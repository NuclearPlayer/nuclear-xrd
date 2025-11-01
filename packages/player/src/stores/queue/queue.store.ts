import { create } from 'zustand';

import type { QueueItem, Track } from '@nuclearplayer/model';

import type { Queue, RepeatMode } from './queue.types';

type QueueStore = Queue & {
  loaded: boolean;
  loadFromDisk: () => Promise<void>;
  addToQueue: (tracks: Track[]) => void;
  addNext: (tracks: Track[]) => void;
  addAt: (tracks: Track[], index: number) => void;
  removeByIds: (ids: string[]) => void;
  removeByIndices: (indices: number[]) => void;
  clearQueue: () => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  updateItemState: (id: string, updates: Partial<QueueItem>) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToIndex: (index: number) => void;
  goToId: (id: string) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setShuffleEnabled: (enabled: boolean) => void;
  getCurrentItem: () => QueueItem | undefined;
};

export const useQueueStore = create<QueueStore>((set, get) => ({
  items: [],
  currentIndex: 0,
  repeatMode: 'off',
  shuffleEnabled: false,
  loaded: false,

  loadFromDisk: async () => {
    set({ loaded: true });
  },

  addToQueue: (tracks: Track[]) => {
    void tracks;
  },

  addNext: (tracks: Track[]) => {
    void tracks;
  },

  addAt: (tracks: Track[], index: number) => {
    void tracks;
    void index;
  },

  removeByIds: (ids: string[]) => {
    void ids;
  },

  removeByIndices: (indices: number[]) => {
    void indices;
  },

  clearQueue: () => {
    set({ items: [], currentIndex: 0 });
  },

  reorder: (fromIndex: number, toIndex: number) => {
    void fromIndex;
    void toIndex;
  },

  updateItemState: (id: string, updates: Partial<QueueItem>) => {
    void id;
    void updates;
  },

  goToNext: () => {
    const { currentIndex, items } = get();
    if (currentIndex < items.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  goToPrevious: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  goToIndex: (index: number) => {
    const { items } = get();
    if (index >= 0 && index < items.length) {
      set({ currentIndex: index });
    }
  },

  goToId: (id: string) => {
    const { items } = get();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      set({ currentIndex: index });
    }
  },

  setRepeatMode: (mode: RepeatMode) => {
    set({ repeatMode: mode });
  },

  setShuffleEnabled: (enabled: boolean) => {
    set({ shuffleEnabled: enabled });
  },

  getCurrentItem: () => {
    const { items, currentIndex } = get();
    return items[currentIndex];
  },
}));
