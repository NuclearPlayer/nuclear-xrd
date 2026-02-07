import { v4 as uuidv4 } from 'uuid';

import type { Playlist, PlaylistItem, Track } from '@nuclearplayer/model';

const now = () => new Date().toISOString();

const defaultTrack = (): Track => ({
  title: `Track ${uuidv4()}`,
  artists: [
    {
      name: 'Test Artist',
      roles: [],
      source: { provider: 'test', id: uuidv4() },
    },
  ],
  durationMs: 180000,
  source: { provider: 'test', id: uuidv4() },
});

const defaultItem = (): PlaylistItem => ({
  id: uuidv4(),
  track: defaultTrack(),
  addedAtIso: now(),
});

export class PlaylistBuilder {
  private playlist: Playlist;

  constructor() {
    this.playlist = {
      id: uuidv4(),
      name: 'Test Playlist',
      createdAtIso: now(),
      lastModifiedIso: now(),
      isReadOnly: false,
      items: [],
    };
  }

  withId(id: string): this {
    this.playlist.id = id;
    return this;
  }

  withName(name: string): this {
    this.playlist.name = name;
    return this;
  }

  withItems(items: PlaylistItem[]): this {
    this.playlist.items = items;
    return this;
  }

  withTrackCount(count: number): this {
    this.playlist.items = Array.from({ length: count }, defaultItem);
    return this;
  }

  readOnly(): this {
    this.playlist.isReadOnly = true;
    return this;
  }

  build(): Playlist {
    return {
      ...this.playlist,
      items: this.playlist.items.map((item) => ({ ...item })),
    };
  }
}
