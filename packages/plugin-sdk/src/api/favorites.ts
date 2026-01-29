import type {
  AlbumRef,
  ArtistRef,
  ProviderRef,
  TrackRef,
} from '@nuclearplayer/model';

import type { FavoritesHost, FavoritesListener } from '../types/favorites';

export class FavoritesAPI {
  #host?: FavoritesHost;

  constructor(host?: FavoritesHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: FavoritesHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Favorites host not available');
    }
    return fn(host);
  }

  getTracks() {
    return this.#withHost((h) => h.getTracks());
  }

  getAlbums() {
    return this.#withHost((h) => h.getAlbums());
  }

  getArtists() {
    return this.#withHost((h) => h.getArtists());
  }

  addTrack(ref: TrackRef) {
    return this.#withHost((h) => h.addTrack(ref));
  }

  removeTrack(source: ProviderRef) {
    return this.#withHost((h) => h.removeTrack(source));
  }

  isTrackFavorite(source: ProviderRef) {
    return this.#withHost((h) => h.isTrackFavorite(source));
  }

  addAlbum(ref: AlbumRef) {
    return this.#withHost((h) => h.addAlbum(ref));
  }

  removeAlbum(source: ProviderRef) {
    return this.#withHost((h) => h.removeAlbum(source));
  }

  isAlbumFavorite(source: ProviderRef) {
    return this.#withHost((h) => h.isAlbumFavorite(source));
  }

  addArtist(ref: ArtistRef) {
    return this.#withHost((h) => h.addArtist(ref));
  }

  removeArtist(source: ProviderRef) {
    return this.#withHost((h) => h.removeArtist(source));
  }

  isArtistFavorite(source: ProviderRef) {
    return this.#withHost((h) => h.isArtistFavorite(source));
  }

  subscribe(listener: FavoritesListener) {
    return this.#withHost((h) => h.subscribe(listener));
  }
}
