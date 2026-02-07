import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import type {
  Playlist,
  PlaylistIndexEntry,
  PlaylistItem,
  Track,
} from '@nuclearplayer/model';

import {
  playlistFileStore,
  playlistIndexStore,
} from '../services/playlistFileService';
import { useQueueStore } from './queueStore';

type PlaylistStore = {
  index: PlaylistIndexEntry[];
  playlists: Map<string, Playlist>;
  loaded: boolean;

  loadIndex: () => Promise<void>;
  createPlaylist: (name: string) => Promise<string>;
  deletePlaylist: (id: string) => Promise<void>;
  addTracks: (playlistId: string, tracks: Track[]) => Promise<PlaylistItem[]>;
  removeTracks: (playlistId: string, itemIds: string[]) => Promise<void>;
  saveQueueAsPlaylist: (name: string) => Promise<string>;
  reorderTracks: (
    playlistId: string,
    from: number,
    to: number,
  ) => Promise<void>;
};

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  index: [],
  playlists: new Map(),
  loaded: false,

  loadIndex: async () => {
    const index = await playlistIndexStore.load();
    set({ index, loaded: true });
  },

  createPlaylist: async (name: string) => {
    const now = new Date().toISOString();
    const playlist: Playlist = {
      id: uuidv4(),
      name,
      createdAtIso: now,
      lastModifiedIso: now,
      isReadOnly: false,
      items: [],
    };

    await playlistFileStore.save(playlist);
    const index = await playlistIndexStore.upsert(playlist);

    set((state) => ({
      playlists: new Map(state.playlists).set(playlist.id, playlist),
      index,
    }));

    return playlist.id;
  },

  addTracks: async (playlistId: string, tracks: Track[]) => {
    const playlist = usePlaylistStore.getState().playlists.get(playlistId);
    if (!playlist) {
      return [];
    }

    const newItems: PlaylistItem[] = tracks.map((track) => ({
      id: uuidv4(),
      track,
      addedAtIso: new Date().toISOString(),
    }));

    const updated: Playlist = {
      ...playlist,
      items: [...playlist.items, ...newItems],
      lastModifiedIso: new Date().toISOString(),
    };

    await playlistFileStore.save(updated);
    const index = await playlistIndexStore.upsert(updated);

    set((state) => ({
      playlists: new Map(state.playlists).set(playlistId, updated),
      index,
    }));

    return newItems;
  },

  removeTracks: async (playlistId: string, itemIds: string[]) => {
    const playlist = usePlaylistStore.getState().playlists.get(playlistId);
    if (!playlist) {
      return;
    }

    const idsToRemove = new Set(itemIds);
    const updated: Playlist = {
      ...playlist,
      items: playlist.items.filter((item) => !idsToRemove.has(item.id)),
      lastModifiedIso: new Date().toISOString(),
    };

    await playlistFileStore.save(updated);
    const index = await playlistIndexStore.upsert(updated);

    set((state) => ({
      playlists: new Map(state.playlists).set(playlistId, updated),
      index,
    }));
  },

  reorderTracks: async (playlistId: string, from: number, to: number) => {
    const playlist = usePlaylistStore.getState().playlists.get(playlistId);
    if (!playlist) {
      return;
    }

    const items = [...playlist.items];
    const [moved] = items.splice(from, 1);
    items.splice(to, 0, moved);

    const updated: Playlist = {
      ...playlist,
      items,
      lastModifiedIso: new Date().toISOString(),
    };

    await playlistFileStore.save(updated);

    set((state) => ({
      playlists: new Map(state.playlists).set(playlistId, updated),
    }));
  },

  saveQueueAsPlaylist: async (name: string) => {
    const tracks = useQueueStore.getState().items.map((item) => item.track);
    const now = new Date().toISOString();

    const playlist: Playlist = {
      id: uuidv4(),
      name,
      createdAtIso: now,
      lastModifiedIso: now,
      isReadOnly: false,
      items: tracks.map((track) => ({
        id: uuidv4(),
        track,
        addedAtIso: now,
      })),
    };

    await playlistFileStore.save(playlist);
    const index = await playlistIndexStore.upsert(playlist);

    set((state) => ({
      playlists: new Map(state.playlists).set(playlist.id, playlist),
      index,
    }));

    return playlist.id;
  },

  deletePlaylist: async (id: string) => {
    await playlistFileStore.delete(id);
    const index = await playlistIndexStore.remove(id);

    set((state) => {
      const playlists = new Map(state.playlists);
      playlists.delete(id);
      return { playlists, index };
    });
  },
}));
