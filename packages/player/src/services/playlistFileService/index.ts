import { BaseDirectory, watchImmediate } from '@tauri-apps/plugin-fs';

import type { Playlist, PlaylistIndexEntry } from '@nuclearplayer/model';

import { reportError } from '../../utils/logging';
import { PlaylistFileStore } from './PlaylistFileStore';
import { PlaylistIndexStore } from './PlaylistIndexStore';

const toIndexEntry = (playlist: Playlist): PlaylistIndexEntry => ({
  id: playlist.id,
  name: playlist.name,
  createdAtIso: playlist.createdAtIso,
  lastModifiedIso: playlist.lastModifiedIso,
  isReadOnly: playlist.isReadOnly,
  artwork: playlist.artwork,
  itemCount: playlist.items.length,
  totalDurationMs: playlist.items.reduce(
    (sum, item) => sum + (item.track.durationMs ?? 0),
    0,
  ),
});

export class PlaylistFileService {
  #indexStore = new PlaylistIndexStore();
  #fileStore = new PlaylistFileStore();
  #unwatch: (() => void) | null = null;

  async loadIndex(): Promise<PlaylistIndexEntry[]> {
    return this.#indexStore.load();
  }

  async loadPlaylist(id: string): Promise<Playlist | null> {
    return this.#fileStore.load(id);
  }

  async savePlaylist(playlist: Playlist): Promise<PlaylistIndexEntry[]> {
    await this.#fileStore.save(playlist);
    const index = await this.#indexStore.load();
    const entry = toIndexEntry(playlist);
    const existing = index.findIndex((e) => e.id === playlist.id);
    if (existing >= 0) {
      index[existing] = entry;
    } else {
      index.push(entry);
    }
    await this.#indexStore.save(index);
    return index;
  }

  async deletePlaylist(id: string): Promise<PlaylistIndexEntry[]> {
    await this.#fileStore.delete(id);
    const index = await this.#indexStore.load();
    const updated = index.filter((e) => e.id !== id);
    await this.#indexStore.save(updated);
    return updated;
  }

  async startWatcher(onChanged: () => Promise<void>): Promise<void> {
    if (this.#unwatch) {
      return;
    }
    try {
      this.#unwatch = await watchImmediate(
        'playlists',
        async () => {
          await onChanged();
        },
        { baseDir: BaseDirectory.AppData },
      );
    } catch (error) {
      await reportError('playlists', {
        userMessage: "Couldn't watch playlists directory",
        error,
      });
    }
  }

  stopWatcher(): void {
    if (this.#unwatch) {
      this.#unwatch();
      this.#unwatch = null;
    }
  }
}

export const playlistFileService = new PlaylistFileService();
