import { LazyStore } from '@tauri-apps/plugin-store';
import { create } from 'zustand';

import type {
  AlbumRef,
  ArtistRef,
  ProviderRef,
  Track,
} from '@nuclearplayer/model';
import type { FavoriteEntry, FavoritesData } from '@nuclearplayer/plugin-sdk';

export type { FavoriteEntry, FavoritesData };

const FAVORITES_FILE = 'favorites.json';
const store = new LazyStore(FAVORITES_FILE);

type RefWithSource = { source: ProviderRef };

type FavoritesState = FavoritesData & {
  loaded: boolean;

  loadFromDisk: () => Promise<void>;

  addTrack: (track: Track) => Promise<void>;
  removeTrack: (source: ProviderRef) => Promise<void>;
  isTrackFavorite: (source: ProviderRef) => boolean;

  addAlbum: (ref: AlbumRef) => Promise<void>;
  removeAlbum: (source: ProviderRef) => Promise<void>;
  isAlbumFavorite: (source: ProviderRef) => boolean;

  addArtist: (ref: ArtistRef) => Promise<void>;
  removeArtist: (source: ProviderRef) => Promise<void>;
  isArtistFavorite: (source: ProviderRef) => boolean;
};

const matchesSource = (a: ProviderRef, b: ProviderRef): boolean =>
  a.provider === b.provider && a.id === b.id;

const saveToDisk = async (): Promise<void> => {
  const state = useFavoritesStore.getState();
  await store.set('favorites.tracks', state.tracks);
  await store.set('favorites.albums', state.albums);
  await store.set('favorites.artists', state.artists);
  await store.save();
};

type FavoritesKey = 'tracks' | 'albums' | 'artists';

const getList = <T extends RefWithSource>(key: FavoritesKey) =>
  useFavoritesStore.getState()[key] as unknown as FavoriteEntry<T>[];

const createAddFavorite =
  <T extends RefWithSource>(key: FavoritesKey) =>
  async (ref: T): Promise<void> => {
    const list = getList<T>(key);
    if (list.some((entry) => matchesSource(entry.ref.source, ref.source))) {
      return;
    }
    const entry: FavoriteEntry<T> = {
      ref,
      addedAtIso: new Date().toISOString(),
    };
    useFavoritesStore.setState({ [key]: [...list, entry] });
    await saveToDisk();
  };

const createRemoveFavorite =
  <T extends RefWithSource>(key: FavoritesKey) =>
  async (source: ProviderRef): Promise<void> => {
    const list = getList<T>(key);
    useFavoritesStore.setState({
      [key]: list.filter((entry) => !matchesSource(entry.ref.source, source)),
    });
    await saveToDisk();
  };

const createIsFavorite =
  <T extends RefWithSource>(key: FavoritesKey) =>
  (source: ProviderRef): boolean =>
    getList<T>(key).some((entry) => matchesSource(entry.ref.source, source));

export const useFavoritesStore = create<FavoritesState>(() => ({
  tracks: [],
  albums: [],
  artists: [],
  loaded: false,

  loadFromDisk: async () => {
    const tracks =
      (await store.get<FavoriteEntry<Track>[]>('favorites.tracks')) ?? [];
    const albums =
      (await store.get<FavoriteEntry<AlbumRef>[]>('favorites.albums')) ?? [];
    const artists =
      (await store.get<FavoriteEntry<ArtistRef>[]>('favorites.artists')) ?? [];

    useFavoritesStore.setState({ tracks, albums, artists, loaded: true });
  },

  addTrack: createAddFavorite<Track>('tracks'),
  removeTrack: createRemoveFavorite<Track>('tracks'),
  isTrackFavorite: createIsFavorite<Track>('tracks'),

  addAlbum: createAddFavorite<AlbumRef>('albums'),
  removeAlbum: createRemoveFavorite<AlbumRef>('albums'),
  isAlbumFavorite: createIsFavorite<AlbumRef>('albums'),

  addArtist: createAddFavorite<ArtistRef>('artists'),
  removeArtist: createRemoveFavorite<ArtistRef>('artists'),
  isArtistFavorite: createIsFavorite<ArtistRef>('artists'),
}));

export const initializeFavoritesStore = async (): Promise<void> => {
  await useFavoritesStore.getState().loadFromDisk();
};
