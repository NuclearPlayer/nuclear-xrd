import type {
  Album,
  AlbumRef,
  Artist,
  ArtistRef,
  SearchParams,
  SearchResults,
  TrackRef,
} from '@nuclearplayer/model';
import type { MetadataHost, MetadataProvider } from '@nuclearplayer/plugin-sdk';

import { providersHost } from './providersHost';
import { executeAlbumDetailsSearch } from './search/executeAlbumMetadataSearch';
import {
  executeArtistAlbumsSearch,
  executeArtistDetailsSearch,
  executeArtistRelatedArtistsSearch,
  executeArtistTopTracksSearch,
} from './search/executeArtistMetadataSearch';
import { executeMetadataSearch } from './search/executeMetadataSearch';

export const createMetadataHost = (): MetadataHost => {
  const getActiveMetadataProvider = (): MetadataProvider | undefined => {
    const providers = providersHost.list<'metadata'>('metadata');
    return providers[0] as MetadataProvider | undefined;
  };

  return {
    search: async (params: SearchParams): Promise<SearchResults> => {
      const provider = getActiveMetadataProvider();
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      return executeMetadataSearch(provider, params);
    },

    fetchArtistDetails: async (artistId: string): Promise<Artist> => {
      const provider = getActiveMetadataProvider();
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      return executeArtistDetailsSearch(provider, artistId);
    },

    fetchArtistAlbums: async (artistId: string): Promise<AlbumRef[]> => {
      const provider = getActiveMetadataProvider();
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      return executeArtistAlbumsSearch(provider, artistId);
    },

    fetchArtistTopTracks: async (artistId: string): Promise<TrackRef[]> => {
      const provider = getActiveMetadataProvider();
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      return executeArtistTopTracksSearch(provider, artistId);
    },

    fetchArtistRelatedArtists: async (
      artistId: string,
    ): Promise<ArtistRef[]> => {
      const provider = getActiveMetadataProvider();
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      return executeArtistRelatedArtistsSearch(provider, artistId);
    },

    fetchAlbumDetails: async (albumId: string): Promise<Album> => {
      const provider = getActiveMetadataProvider();
      if (!provider) {
        throw new Error('No metadata provider available');
      }
      return executeAlbumDetailsSearch(provider, albumId);
    },
  };
};

export const metadataHost = createMetadataHost();
