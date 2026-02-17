import type {
  AlbumRef,
  ArtistRef,
  PlaylistRef,
  TrackRef,
} from '@nuclearplayer/model';

import type { AttributedResult, DashboardHost } from '../types/dashboard';

export class DashboardAPI {
  #host?: DashboardHost;

  constructor(host?: DashboardHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: DashboardHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Dashboard host not available');
    }
    return fn(host);
  }

  fetchTopTracks(providerId?: string): Promise<AttributedResult<TrackRef>[]> {
    return this.#withHost((host) => host.fetchTopTracks(providerId));
  }

  fetchTopArtists(providerId?: string): Promise<AttributedResult<ArtistRef>[]> {
    return this.#withHost((host) => host.fetchTopArtists(providerId));
  }

  fetchTopAlbums(providerId?: string): Promise<AttributedResult<AlbumRef>[]> {
    return this.#withHost((host) => host.fetchTopAlbums(providerId));
  }

  fetchEditorialPlaylists(
    providerId?: string,
  ): Promise<AttributedResult<PlaylistRef>[]> {
    return this.#withHost((host) => host.fetchEditorialPlaylists(providerId));
  }

  fetchNewReleases(providerId?: string): Promise<AttributedResult<AlbumRef>[]> {
    return this.#withHost((host) => host.fetchNewReleases(providerId));
  }
}
