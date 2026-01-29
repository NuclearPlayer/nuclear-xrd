import type {
  AlbumRef,
  ArtistRef,
  ProviderRef,
  Track,
} from '@nuclearplayer/model';
import type {
  FavoritesHost,
  FavoritesListener,
} from '@nuclearplayer/plugin-sdk';

import { useFavoritesStore } from '../stores/favoritesStore';

export const createFavoritesHost = (): FavoritesHost => ({
  getTracks: async () => useFavoritesStore.getState().tracks,
  getAlbums: async () => useFavoritesStore.getState().albums,
  getArtists: async () => useFavoritesStore.getState().artists,

  addTrack: async (track: Track) =>
    useFavoritesStore.getState().addTrack(track),
  removeTrack: async (source: ProviderRef) =>
    useFavoritesStore.getState().removeTrack(source),
  isTrackFavorite: async (source: ProviderRef) =>
    useFavoritesStore.getState().isTrackFavorite(source),

  addAlbum: async (ref: AlbumRef) => useFavoritesStore.getState().addAlbum(ref),
  removeAlbum: async (source: ProviderRef) =>
    useFavoritesStore.getState().removeAlbum(source),
  isAlbumFavorite: async (source: ProviderRef) =>
    useFavoritesStore.getState().isAlbumFavorite(source),

  addArtist: async (ref: ArtistRef) =>
    useFavoritesStore.getState().addArtist(ref),
  removeArtist: async (source: ProviderRef) =>
    useFavoritesStore.getState().removeArtist(source),
  isArtistFavorite: async (source: ProviderRef) =>
    useFavoritesStore.getState().isArtistFavorite(source),

  subscribe: (listener: FavoritesListener) =>
    useFavoritesStore.subscribe((state) =>
      listener({
        tracks: state.tracks,
        albums: state.albums,
        artists: state.artists,
      }),
    ),
});

export const favoritesHost = createFavoritesHost();
