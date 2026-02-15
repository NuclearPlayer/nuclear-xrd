import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ArtistMetadataCapability,
  SearchParams,
} from '@nuclearplayer/plugin-sdk';

import { MetadataProviderBuilder } from '../test/builders/MetadataProviderBuilder';
import { metadataHost } from './metadataHost';
import { providersHost } from './providersHost';

describe('metadataHost', () => {
  afterEach(() => {
    providersHost.clear();
  });

  describe('search', () => {
    it('calls unified search when capability present', async () => {
      const search = vi.fn().mockResolvedValue({
        tracks: ['track 1'],
        artists: ['artist 1'],
        albums: ['album 1'],
        playlists: ['playlist 1'],
      });

      const provider = new MetadataProviderBuilder()
        .withId('test-provider')
        .withSearchCapabilities(['unified'])
        .withSearch(search)
        .build();

      providersHost.register(provider);

      const res = await metadataHost.search({ query: 'radiohead' });
      expect(search).toHaveBeenCalledTimes(1);
      expect(search).toHaveBeenCalledWith({ query: 'radiohead' });
      expect(res).toEqual({
        tracks: ['track 1'],
        artists: ['artist 1'],
        albums: ['album 1'],
        playlists: ['playlist 1'],
      });
    });

    it('dispatches to category methods when unified is not available', async () => {
      const searchArtists = vi.fn().mockResolvedValue(['a1']);
      const searchAlbums = vi.fn().mockResolvedValue(['al1']);
      const searchTracks = vi.fn().mockResolvedValue(['t1']);
      const searchPlaylists = vi.fn().mockResolvedValue(['p1']);

      const provider = new MetadataProviderBuilder()
        .withId('test-provider')
        .withSearchCapabilities(['artists', 'albums', 'tracks', 'playlists'])
        .withSearchArtists(searchArtists)
        .withSearchAlbums(searchAlbums)
        .withSearchTracks(searchTracks)
        .withSearchPlaylists(searchPlaylists)
        .build();

      providersHost.register(provider);

      const res = await metadataHost.search({ query: 'daft punk' });

      expect(searchArtists).toHaveBeenCalledWith({
        query: 'daft punk',
        limit: undefined,
      });
      expect(searchAlbums).toHaveBeenCalledWith({
        query: 'daft punk',
        limit: undefined,
      });
      expect(searchTracks).toHaveBeenCalledWith({
        query: 'daft punk',
        limit: undefined,
      });
      expect(searchPlaylists).toHaveBeenCalledWith({
        query: 'daft punk',
        limit: undefined,
      });

      expect(res).toEqual({
        tracks: ['t1'],
        artists: ['a1'],
        albums: ['al1'],
        playlists: ['p1'],
      });
    });

    it('respects requested types subset', async () => {
      const searchArtists = vi.fn();
      const searchAlbums = vi.fn();
      const searchTracks = vi.fn();
      const searchPlaylists = vi.fn();

      const provider = new MetadataProviderBuilder()
        .withId('test-provider')
        .withSearchCapabilities(['artists', 'albums', 'tracks', 'playlists'])
        .withSearchArtists(searchArtists)
        .withSearchAlbums(searchAlbums)
        .withSearchTracks(searchTracks)
        .withSearchPlaylists(searchPlaylists)
        .build();

      providersHost.register(provider);

      await metadataHost.search({
        query: 'foo',
        types: ['artists', 'albums'],
      });

      expect(searchArtists).toHaveBeenCalledTimes(1);
      expect(searchAlbums).toHaveBeenCalledTimes(1);
      expect(searchTracks).not.toHaveBeenCalled();
      expect(searchPlaylists).not.toHaveBeenCalled();
    });

    it('does not call any category methods when types is an empty array', async () => {
      const searchArtists = vi.fn();
      const searchAlbums = vi.fn();
      const searchTracks = vi.fn();
      const searchPlaylists = vi.fn();

      const provider = new MetadataProviderBuilder()
        .withId('test-provider')
        .withSearchCapabilities(['artists', 'albums', 'tracks', 'playlists'])
        .withSearchArtists(searchArtists)
        .withSearchAlbums(searchAlbums)
        .withSearchTracks(searchTracks)
        .withSearchPlaylists(searchPlaylists)
        .build();

      providersHost.register(provider);

      const res = await metadataHost.search({
        query: 'bar',
        types: [],
      });

      expect(searchArtists).not.toHaveBeenCalled();
      expect(searchAlbums).not.toHaveBeenCalled();
      expect(searchTracks).not.toHaveBeenCalled();
      expect(searchPlaylists).not.toHaveBeenCalled();
      expect(res).toEqual({});
    });

    it('throws if no provider available', async () => {
      await expect(metadataHost.search({ query: 'foo' })).rejects.toThrow(
        'No metadata provider available',
      );
    });
  });

  describe('artist metadata', () => {
    it.each([
      {
        method: 'fetchArtistBio',
        mockMethod: 'withFetchArtistBio',
        capability: 'artistBio',
      },
      {
        method: 'fetchArtistSocialStats',
        mockMethod: 'withFetchArtistSocialStats',
        capability: 'artistSocialStats',
      },
      {
        method: 'fetchArtistAlbums',
        mockMethod: 'withFetchArtistAlbums',
        capability: 'artistAlbums',
      },
      {
        method: 'fetchArtistTopTracks',
        mockMethod: 'withFetchArtistTopTracks',
        capability: 'artistTopTracks',
      },
      {
        method: 'fetchArtistPlaylists',
        mockMethod: 'withFetchArtistPlaylists',
        capability: 'artistPlaylists',
      },
      {
        method: 'fetchArtistRelatedArtists',
        mockMethod: 'withFetchArtistRelatedArtists',
        capability: 'artistRelatedArtists',
      },
    ])('fetches $capability', async ({ method, mockMethod, capability }) => {
      const mockFn = vi.fn().mockResolvedValue('result');
      const providerBuilder = new MetadataProviderBuilder()
        .withId('test-provider')
        .withArtistMetadataCapabilities([
          capability as ArtistMetadataCapability,
        ]);

      // Dynamic builder method call
      providerBuilder[mockMethod as keyof MetadataProviderBuilder](
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockFn as any,
      );
      const provider = providerBuilder.build();

      providersHost.register(provider);

      // Dynamic host method call
      const result = await metadataHost[method as keyof typeof metadataHost](
        'artist-id' as string & SearchParams,
      );

      expect(mockFn).toHaveBeenCalledWith('artist-id');
      expect(result).toBe('result');
    });

    it.each([
      { method: 'fetchArtistBio', capability: 'artistBio' },
      { method: 'fetchArtistSocialStats', capability: 'artistSocialStats' },
      { method: 'fetchArtistAlbums', capability: 'artistAlbums' },
      { method: 'fetchArtistTopTracks', capability: 'artistTopTracks' },
      { method: 'fetchArtistPlaylists', capability: 'artistPlaylists' },
      {
        method: 'fetchArtistRelatedArtists',
        capability: 'artistRelatedArtists',
      },
    ])('throws if capability missing', async ({ method, capability }) => {
      const provider = new MetadataProviderBuilder()
        .withId('test-provider')
        .withArtistMetadataCapabilities([])
        .build();

      providersHost.register(provider);

      await expect(
        metadataHost[method as keyof typeof metadataHost](
          'artist-id' as string & SearchParams,
        ),
      ).rejects.toThrowError(`Missing capability: ${capability}`);
    });
  });

  describe('album metadata', () => {
    it('fetches album details', async () => {
      const fetchAlbumDetails = vi.fn().mockResolvedValue('album-details');
      const provider = new MetadataProviderBuilder()
        .withId('test-provider')
        .withAlbumMetadataCapabilities(['albumDetails'])
        .withFetchAlbumDetails(fetchAlbumDetails)
        .build();

      providersHost.register(provider);

      const result = await metadataHost.fetchAlbumDetails('album-id');

      expect(fetchAlbumDetails).toHaveBeenCalledWith('album-id');
      expect(result).toBe('album-details');
    });

    it('throws if capability missing', async () => {
      const provider = new MetadataProviderBuilder()
        .withId('test-provider')
        .withAlbumMetadataCapabilities([])
        .build();

      providersHost.register(provider);

      await expect(
        metadataHost.fetchAlbumDetails('album-id'),
      ).rejects.toThrowError('Missing capability: albumDetails');
    });
  });
});
