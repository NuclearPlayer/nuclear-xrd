import type {
  AlbumRef,
  ArtistRef,
  ProviderRef,
  TrackRef,
} from '@nuclearplayer/model';

export type FavoriteEntry<T> = {
  ref: T;
  addedAtIso: string;
};

export type FavoritesData = {
  tracks: FavoriteEntry<TrackRef>[];
  albums: FavoriteEntry<AlbumRef>[];
  artists: FavoriteEntry<ArtistRef>[];
};

export type FavoritesListener = (favorites: FavoritesData) => void;

export type FavoritesHost = {
  getTracks: () => Promise<FavoriteEntry<TrackRef>[]>;
  getAlbums: () => Promise<FavoriteEntry<AlbumRef>[]>;
  getArtists: () => Promise<FavoriteEntry<ArtistRef>[]>;

  addTrack: (ref: TrackRef) => Promise<void>;
  removeTrack: (source: ProviderRef) => Promise<void>;
  isTrackFavorite: (source: ProviderRef) => Promise<boolean>;

  addAlbum: (ref: AlbumRef) => Promise<void>;
  removeAlbum: (source: ProviderRef) => Promise<void>;
  isAlbumFavorite: (source: ProviderRef) => Promise<boolean>;

  addArtist: (ref: ArtistRef) => Promise<void>;
  removeArtist: (source: ProviderRef) => Promise<void>;
  isArtistFavorite: (source: ProviderRef) => Promise<boolean>;

  subscribe: (listener: FavoritesListener) => () => void;
};
