import { create } from 'zustand';

import type { Playlist, PlaylistIndexEntry } from '@nuclearplayer/model';

import { playlistIndexStore } from '../services/playlistFileService';

type PlaylistStore = {
  index: PlaylistIndexEntry[];
  playlists: Map<string, Playlist>;
  loaded: boolean;

  loadIndex: () => Promise<void>;
};

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  index: [],
  playlists: new Map(),
  loaded: false,

  loadIndex: async () => {
    const index = await playlistIndexStore.load();
    set({ index, loaded: true });
  },
}));
