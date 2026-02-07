import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import type { Playlist, PlaylistIndexEntry } from '@nuclearplayer/model';

import {
  playlistFileStore,
  playlistIndexStore,
} from '../services/playlistFileService';

type PlaylistStore = {
  index: PlaylistIndexEntry[];
  playlists: Map<string, Playlist>;
  loaded: boolean;

  loadIndex: () => Promise<void>;
  createPlaylist: (name: string) => Promise<string>;
  deletePlaylist: (id: string) => Promise<void>;
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
