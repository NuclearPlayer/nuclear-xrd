import type { SearchParams } from '@nuclearplayer/model';

import type { MetadataHost } from '../types/metadata';

export class MetadataAPI {
  #host?: MetadataHost;

  constructor(host?: MetadataHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: MetadataHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Metadata host not available');
    }
    return fn(host);
  }

  search(params: SearchParams, providerId?: string) {
    return this.#withHost((h) => h.search(params, providerId));
  }

  fetchArtistDetails(artistId: string, providerId?: string) {
    return this.#withHost((h) => h.fetchArtistDetails(artistId, providerId));
  }

  fetchArtistAlbums(artistId: string, providerId?: string) {
    return this.#withHost((h) => h.fetchArtistAlbums(artistId, providerId));
  }

  fetchArtistTopTracks(artistId: string, providerId?: string) {
    return this.#withHost((h) => h.fetchArtistTopTracks(artistId, providerId));
  }

  fetchArtistRelatedArtists(artistId: string, providerId?: string) {
    return this.#withHost((h) =>
      h.fetchArtistRelatedArtists(artistId, providerId),
    );
  }

  fetchAlbumDetails(albumId: string, providerId?: string) {
    return this.#withHost((h) => h.fetchAlbumDetails(albumId, providerId));
  }
}
