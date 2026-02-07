import { LazyStore } from '@tauri-apps/plugin-store';

import type { Playlist, PlaylistIndexEntry } from '@nuclearplayer/model';

const PLAYLISTS_DIR = 'playlists';

const toIndexEntry = (playlist: Playlist): PlaylistIndexEntry => {
  const { items, ...rest } = playlist;
  return {
    ...rest,
    itemCount: items.length,
    totalDurationMs: items.reduce(
      (sum, item) => sum + (item.track.durationMs ?? 0),
      0,
    ),
  };
};

export class PlaylistIndexStore {
  #store = new LazyStore(`${PLAYLISTS_DIR}/index.json`);

  async load(): Promise<PlaylistIndexEntry[]> {
    return (await this.#store.get<PlaylistIndexEntry[]>('entries')) ?? [];
  }

  async upsert(playlist: Playlist): Promise<void> {
    const index = await this.load();
    const entry = toIndexEntry(playlist);
    const existing = index.findIndex((e) => e.id === playlist.id);
    if (existing >= 0) {
      index[existing] = entry;
    } else {
      index.push(entry);
    }
    await this.#store.set('entries', index);
    await this.#store.save();
  }

  async remove(id: string): Promise<void> {
    const index = await this.load();
    await this.#store.set(
      'entries',
      index.filter((e) => e.id !== id),
    );
    await this.#store.save();
  }
}

export class PlaylistFileStore {
  #stores = new Map<string, LazyStore>();

  #get(id: string): LazyStore {
    let store = this.#stores.get(id);
    if (!store) {
      store = new LazyStore(`${PLAYLISTS_DIR}/${id}.json`);
      this.#stores.set(id, store);
    }
    return store;
  }

  async load(id: string): Promise<Playlist | null> {
    return (await this.#get(id).get<Playlist>('playlist')) ?? null;
  }

  async save(playlist: Playlist): Promise<void> {
    const store = this.#get(playlist.id);
    await store.set('playlist', playlist);
    await store.save();
  }

  async delete(id: string): Promise<void> {
    const store = this.#get(id);
    await store.delete('playlist');
    await store.save();
    this.#stores.delete(id);
  }
}

export const playlistIndexStore = new PlaylistIndexStore();
export const playlistFileStore = new PlaylistFileStore();
