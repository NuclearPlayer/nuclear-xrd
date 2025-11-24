import type {
  Album,
  AlbumRef,
  Artist,
  ArtistRef,
  SearchCategory,
  SearchParams,
  SearchResults,
  TrackRef,
} from '@nuclearplayer/model';
import {
  MissingCapabilityError,
  type MetadataHost,
  type MetadataProvider,
} from '@nuclearplayer/plugin-sdk';

import { providersHost } from './providersHost';

const ALL_CATEGORIES: SearchCategory[] = [
  'artists',
  'albums',
  'tracks',
  'playlists',
];

const onlyCategories = (values: string[] | undefined): SearchCategory[] => {
  if (!values) {
    return [];
  }

  // Dedupe categories and filter out junk
  const set = new Set<SearchCategory>(ALL_CATEGORIES);
  return values.filter((v): v is SearchCategory =>
    set.has(v as SearchCategory),
  );
};

const resolveTypes = (
  provider: MetadataProvider,
  requested: SearchCategory[] | undefined,
): SearchCategory[] => {
  return requested ?? onlyCategories(provider.searchCapabilities);
};

const executeMetadataSearch = async (
  provider: MetadataProvider,
  params: SearchParams,
): Promise<SearchResults> => {
  const unified =
    provider.searchCapabilities?.includes('unified') && provider.search;
  if (unified) {
    return provider.search!(params);
  }

  const types = resolveTypes(provider, params.types);
  const want = new Set(types);

  const artistsPromise =
    want.has('artists') && provider.searchArtists
      ? provider.searchArtists({ query: params.query, limit: params.limit })
      : undefined;
  const albumsPromise =
    want.has('albums') && provider.searchAlbums
      ? provider.searchAlbums({ query: params.query, limit: params.limit })
      : undefined;
  const tracksPromise =
    want.has('tracks') && provider.searchTracks
      ? provider.searchTracks({ query: params.query, limit: params.limit })
      : undefined;
  const playlistsPromise =
    want.has('playlists') && provider.searchPlaylists
      ? provider.searchPlaylists({ query: params.query, limit: params.limit })
      : undefined;

  const [artists, albums, tracks, playlists] = await Promise.all([
    artistsPromise ?? Promise.resolve(undefined),
    albumsPromise ?? Promise.resolve(undefined),
    tracksPromise ?? Promise.resolve(undefined),
    playlistsPromise ?? Promise.resolve(undefined),
  ]);

  const result: SearchResults = {};
  if (artists) {
    result.artists = artists;
  }
  if (albums) {
    result.albums = albums;
  }
  if (tracks) {
    result.tracks = tracks;
  }
  if (playlists) {
    result.playlists = playlists;
  }
  return result;
};

export const createMetadataHost = (): MetadataHost => {
  const getProvider = (providerId?: string): MetadataProvider | undefined => {
    if (providerId) {
      return providersHost.get(providerId) as MetadataProvider | undefined;
    }
    const providers = providersHost.list<'metadata'>('metadata');
    return providers[0] as MetadataProvider | undefined;
  };

  return {
    search: async (
      params: SearchParams,
      providerId?: string,
    ): Promise<SearchResults> => {
      const provider = getProvider(providerId);
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      return executeMetadataSearch(provider, params);
    },

    fetchArtistDetails: async (
      artistId: string,
      providerId?: string,
    ): Promise<Artist> => {
      const provider = getProvider(providerId);
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      if (!provider.artistMetadataCapabilities?.includes('artistDetails')) {
        throw new MissingCapabilityError('artistDetails');
      }
      return provider.fetchArtistDetails!(artistId)!;
    },

    fetchArtistAlbums: async (
      artistId: string,
      providerId?: string,
    ): Promise<AlbumRef[]> => {
      const provider = getProvider(providerId);
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      if (!provider.artistMetadataCapabilities?.includes('artistAlbums')) {
        throw new MissingCapabilityError('artistAlbums');
      }
      return provider.fetchArtistAlbums!(artistId)!;
    },

    fetchArtistTopTracks: async (
      artistId: string,
      providerId?: string,
    ): Promise<TrackRef[]> => {
      const provider = getProvider(providerId);
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      if (!provider.artistMetadataCapabilities?.includes('artistTopTracks')) {
        throw new MissingCapabilityError('artistTopTracks');
      }
      return provider.fetchArtistTopTracks!(artistId)!;
    },

    fetchArtistRelatedArtists: async (
      artistId: string,
      providerId?: string,
    ): Promise<ArtistRef[]> => {
      const provider = getProvider(providerId);
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      if (
        !provider.artistMetadataCapabilities?.includes('artistRelatedArtists')
      ) {
        throw new MissingCapabilityError('artistRelatedArtists');
      }
      return provider.fetchArtistRelatedArtists!(artistId)!;
    },

    fetchAlbumDetails: async (
      albumId: string,
      providerId?: string,
    ): Promise<Album> => {
      const provider = getProvider(providerId);
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      if (!provider.albumMetadataCapabilities?.includes('albumDetails')) {
        throw new MissingCapabilityError('albumDetails');
      }
      return provider.fetchAlbumDetails!(albumId)!;
    },
  };
};

export const metadataHost = createMetadataHost();
