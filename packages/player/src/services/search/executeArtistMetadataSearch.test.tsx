import {
  ArtistMetadataCapability,
  MetadataProvider,
} from '@nuclearplayer/plugin-sdk';

import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import {
  executeArtistAlbumsSearch,
  executeArtistDetailsSearch,
  executeArtistRelatedArtistsSearch,
  executeArtistTopTracksSearch,
} from './executeArtistMetadataSearch';

describe('executeDetailsSearch', () => {
  it.each([
    {
      method: executeArtistDetailsSearch,
      methodName: 'fetchArtistDetails',
      capability: 'artistDetails',
      capabilityName: 'artist details',
    },
    {
      method: executeArtistAlbumsSearch,
      methodName: 'fetchArtistAlbums',
      capability: 'artistAlbums',
      capabilityName: 'artist albums',
    },
    {
      method: executeArtistTopTracksSearch,
      methodName: 'fetchArtistTopTracks',
      capability: 'artistTopTracks',
      capabilityName: 'artist top tracks',
    },
    {
      method: executeArtistRelatedArtistsSearch,
      methodName: 'fetchArtistRelatedArtists',
      capability: 'artistRelatedArtists',
      capabilityName: 'artist related artists',
    },
  ])('fetches $capabilityName', async ({ method, methodName, capability }) => {
    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities([])
      .withArtistMetadataCapabilities([capability as ArtistMetadataCapability])
      .build();

    // @ts-expect-error a somewhat hacky way to mock provider methods
    provider[methodName as keyof MetadataProvider] = vi.fn();

    await method(provider, 'artist-id');
    expect(provider[methodName as keyof MetadataProvider]).toHaveBeenCalledWith(
      'artist-id',
    );
  });

  it.each([
    { method: executeArtistDetailsSearch, capability: 'artistDetails' },
    { method: executeArtistAlbumsSearch, capability: 'artistAlbums' },
    { method: executeArtistTopTracksSearch, capability: 'artistTopTracks' },
    {
      method: executeArtistRelatedArtistsSearch,
      capability: 'artistRelatedArtists',
    },
  ])('throws if capability missing', async ({ method, capability }) => {
    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities([])
      .withArtistMetadataCapabilities([])
      .build();

    expect(method(provider, 'artist-id')).rejects.toThrowError(
      `Missing capability: ${capability}`,
    );
  });
});
