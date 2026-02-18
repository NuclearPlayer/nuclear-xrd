import type {
  AlbumRef,
  ArtistRef,
  PlaylistRef,
  Track,
} from '@nuclearplayer/model';

import type { ProviderDescriptor } from './providers';

export type DashboardCapability =
  | 'topTracks'
  | 'topArtists'
  | 'topAlbums'
  | 'editorialPlaylists'
  | 'newReleases';

export type DashboardProvider = ProviderDescriptor<'dashboard'> & {
  metadataProviderId?: string;
  capabilities: DashboardCapability[];

  fetchTopTracks?: () => Promise<Track[]>;
  fetchTopArtists?: () => Promise<ArtistRef[]>;
  fetchTopAlbums?: () => Promise<AlbumRef[]>;
  fetchEditorialPlaylists?: () => Promise<PlaylistRef[]>;
  fetchNewReleases?: () => Promise<AlbumRef[]>;
};

export type AttributedResult<T> = {
  providerId: string;
  metadataProviderId?: string;
  providerName: string;
  items: T[];
};

export type DashboardHost = {
  fetchTopTracks: (providerId?: string) => Promise<AttributedResult<Track>[]>;
  fetchTopArtists: (
    providerId?: string,
  ) => Promise<AttributedResult<ArtistRef>[]>;
  fetchTopAlbums: (
    providerId?: string,
  ) => Promise<AttributedResult<AlbumRef>[]>;
  fetchEditorialPlaylists: (
    providerId?: string,
  ) => Promise<AttributedResult<PlaylistRef>[]>;
  fetchNewReleases: (
    providerId?: string,
  ) => Promise<AttributedResult<AlbumRef>[]>;
};
