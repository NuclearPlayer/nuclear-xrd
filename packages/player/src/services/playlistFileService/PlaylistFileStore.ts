import { BaseDirectory, remove } from '@tauri-apps/plugin-fs';
import { LazyStore } from '@tauri-apps/plugin-store';

import type { Playlist } from '@nuclearplayer/model';
import { playlistSchema } from '@nuclearplayer/model';

import { Logger } from '../logger';
import { loadValidated } from '../validatedStore';

const PLAYLISTS_DIR = 'playlists';
const MAX_CACHED_STORES = 20;

export class PlaylistFileStore {
  #stores = new Map<string, LazyStore>();
  #accessOrder: string[] = [];

  #get(id: string): LazyStore {
    let store = this.#stores.get(id);
    if (!store) {
      store = new LazyStore(`${PLAYLISTS_DIR}/${id}.json`);
      this.#stores.set(id, store);
    }
    this.#touch(id);
    return store;
  }

  #touch(id: string): void {
    this.#accessOrder = this.#accessOrder.filter((i) => i !== id);
    this.#accessOrder.push(id);
    void this.#evict();
  }

  async #evict(): Promise<void> {
    while (this.#accessOrder.length > MAX_CACHED_STORES) {
      const evictId = this.#accessOrder.shift();
      if (evictId) {
        const store = this.#stores.get(evictId);
        if (store) {
          this.#stores.delete(evictId);
          await store.close();
        }
      }
    }
  }

  async load(id: string): Promise<Playlist | null> {
    return loadValidated(
      this.#get(id),
      'playlist',
      playlistSchema,
      'playlists',
    );
  }

  async save(playlist: Playlist): Promise<void> {
    const store = this.#get(playlist.id);
    await store.set('playlist', playlist);
    await store.save();
  }

  async delete(id: string): Promise<void> {
    const store = this.#get(id);
    await store.clear();
    await store.save();
    await store.close();
    this.#stores.delete(id);
    this.#accessOrder = this.#accessOrder.filter((i) => i !== id);

    try {
      await remove(`${PLAYLISTS_DIR}/${id}.json`, {
        baseDir: BaseDirectory.AppData,
      });
    } catch {
      Logger.playlists.warn(
        `Failed to delete playlist file for id ${id}. It may have already been removed.`,
      );
    }
  }
}
