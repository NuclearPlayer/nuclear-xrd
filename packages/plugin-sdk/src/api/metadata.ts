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

  search(params: SearchParams) {
    return this.#withHost((h) => h.search(params));
  }

  fetchArtistDetails(artistId: string) {
    return this.#withHost((h) => h.fetchArtistDetails(artistId));
  }

  fetchArtistAlbums(artistId: string) {
    return this.#withHost((h) => h.fetchArtistAlbums(artistId));
  }

  fetchArtistTopTracks(artistId: string) {
    return this.#withHost((h) => h.fetchArtistTopTracks(artistId));
  }

  fetchArtistRelatedArtists(artistId: string) {
    return this.#withHost((h) => h.fetchArtistRelatedArtists(artistId));
  }

  fetchAlbumDetails(albumId: string) {
    return this.#withHost((h) => h.fetchAlbumDetails(albumId));
  }
}
