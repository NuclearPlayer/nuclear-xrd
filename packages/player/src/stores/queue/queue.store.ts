import { LazyStore } from '@tauri-apps/plugin-store';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import type { QueueItem, Track } from '@nuclearplayer/model';

import type { Queue, RepeatMode } from './queue.types';

const QUEUE_FILE = 'queue.json';
const store = new LazyStore(QUEUE_FILE);

type QueueStore = Queue & {
  isLoading: boolean;
  isReady: boolean;
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

const createQueueItem = (track: Track): QueueItem => ({
  id: uuidv4(),
  track,
  status: 'idle',
  activeStreamIndex: 0,
  failedStreamIndices: [],
  addedAtIso: new Date().toISOString(),
});

export const useQueueStore = create<QueueStore>((set, get) => ({
  items: [],
  currentIndex: 0,
  repeatMode: 'off',
  shuffleEnabled: false,
  isReady: false,
  isLoading: false,

  loadFromDisk: async () => {
    set({ isLoading: true });
    const items = (await store.get<QueueItem[]>('queue.items')) ?? [];
    const currentIndex = (await store.get<number>('queue.currentIndex')) ?? 0;
    const repeatMode =
      (await store.get<RepeatMode>('queue.repeatMode')) ?? 'off';
    const shuffleEnabled =
      (await store.get<boolean>('queue.shuffleEnabled')) ?? false;

    const sanitizedIndex =
      currentIndex >= 0 && currentIndex < items.length ? currentIndex : 0;

    set({
      items,
      currentIndex: sanitizedIndex,
      repeatMode,
      shuffleEnabled,
      isReady: true,
      isLoading: false,
    });
  },

  addToQueue: (tracks: Track[]) => {
    set(
      produce((state: QueueStore) => {
        const newItems = tracks.map(createQueueItem);
        state.items.push(...newItems);
      }),
    );
    void saveToDisk();
  },

  addNext: (tracks: Track[]) => {
    set(
      produce((state: QueueStore) => {
        const newItems = tracks.map(createQueueItem);
        const insertIndex = state.currentIndex + 1;
        state.items.splice(insertIndex, 0, ...newItems);
      }),
    );
    void saveToDisk();
  },

  addAt: (tracks: Track[], index: number) => {
    set(
      produce((state: QueueStore) => {
        const newItems = tracks.map(createQueueItem);
        state.items.splice(index, 0, ...newItems);
        if (index <= state.currentIndex) {
          state.currentIndex += newItems.length;
        }
      }),
    );
    void saveToDisk();
  },

  removeByIds: (ids: string[]) => {
    set(
      produce((state: QueueStore) => {
        const idsSet = new Set(ids);
        const removedBeforeCurrent = state.items
          .slice(0, state.currentIndex)
          .filter((item) => idsSet.has(item.id)).length;

        state.items = state.items.filter((item) => !idsSet.has(item.id));
        state.currentIndex = Math.max(
          0,
          state.currentIndex - removedBeforeCurrent,
        );

        if (state.currentIndex >= state.items.length) {
          state.currentIndex = Math.max(0, state.items.length - 1);
        }
      }),
    );
    void saveToDisk();
  },

  removeByIndices: (indices: number[]) => {
    set(
      produce((state: QueueStore) => {
        const indicesSet = new Set(indices);
        const removedBeforeCurrent = indices.filter(
          (idx) => idx < state.currentIndex,
        ).length;

        state.items = state.items.filter((_, idx) => !indicesSet.has(idx));
        state.currentIndex = Math.max(
          0,
          state.currentIndex - removedBeforeCurrent,
        );

        if (state.currentIndex >= state.items.length) {
          state.currentIndex = Math.max(0, state.items.length - 1);
        }
      }),
    );
    void saveToDisk();
  },

  clearQueue: () => {
    set({ items: [], currentIndex: 0 });
    void saveToDisk();
  },

  reorder: (fromIndex: number, toIndex: number) => {
    set(
      produce((state: QueueStore) => {
        const [movedItem] = state.items.splice(fromIndex, 1);
        state.items.splice(toIndex, 0, movedItem);

        if (state.currentIndex === fromIndex) {
          state.currentIndex = toIndex;
        } else if (
          fromIndex < state.currentIndex &&
          toIndex >= state.currentIndex
        ) {
          state.currentIndex -= 1;
        } else if (
          fromIndex > state.currentIndex &&
          toIndex <= state.currentIndex
        ) {
          state.currentIndex += 1;
        }
      }),
    );
    void saveToDisk();
  },

  updateItemState: (id: string, updates: Partial<QueueItem>) => {
    set(
      produce((state: QueueStore) => {
        const item = state.items.find((item) => item.id === id);
        if (item) {
          Object.assign(item, updates);
        }
      }),
    );
    void saveToDisk();
  },

  goToNext: () => {
    const { currentIndex, items } = get();
    if (currentIndex < items.length - 1) {
      set({ currentIndex: currentIndex + 1 });
      void saveToDisk();
    }
  },

  goToPrevious: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
      void saveToDisk();
    }
  },

  goToIndex: (index: number) => {
    const { items } = get();
    if (index >= 0 && index < items.length) {
      set({ currentIndex: index });
      void saveToDisk();
    }
  },

  goToId: (id: string) => {
    const { items } = get();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      set({ currentIndex: index });
      void saveToDisk();
    }
  },

  setRepeatMode: (mode: RepeatMode) => {
    set({ repeatMode: mode });
    void saveToDisk();
  },

  setShuffleEnabled: (enabled: boolean) => {
    set({ shuffleEnabled: enabled });
    void saveToDisk();
  },

  getCurrentItem: () => {
    const { items, currentIndex } = get();
    return items[currentIndex];
  },
}));

const saveToDisk = async (): Promise<void> => {
  const state = useQueueStore.getState();
  await store.set('queue.items', state.items);
  await store.set('queue.currentIndex', state.currentIndex);
  await store.set('queue.repeatMode', state.repeatMode);
  await store.set('queue.shuffleEnabled', state.shuffleEnabled);
  await store.save();
};

export const initializeQueueStore = async (): Promise<void> => {
  await useQueueStore.getState().loadFromDisk();
};
