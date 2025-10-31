import { screen } from '@testing-library/react';

import { providersServiceHost } from '../../services/providersService';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { AlbumWrapper } from './Album.test-wrapper';

describe('Album view', () => {
  beforeEach(() => {
    providersServiceHost.clear();
    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities(['unified', 'albums'])
      .withAlbumMetadataCapabilities(['albumDetails'])
      .withSearch(async () => ({
        albums: [
          {
            title: 'Test Album',
            artists: [
              {
                name: 'Test Artist',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            artwork: {
              items: [
                {
                  url: 'https://img/album-cover.jpg',
                  purpose: 'cover',
                  width: 600,
                },
              ],
            },
            source: {
              provider: 'test-metadata-provider',
              id: 'test-album-id',
            },
          },
        ],
      }))
      .withFetchAlbumDetails(async () => ({
        title: 'Prism',
        artists: [
          {
            name: 'John Butler',
            roles: [],
          },
        ],
        tracks: [
          {
            title: 'Going Solo',
            artists: [
              {
                name: 'John Butler',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            source: {
              provider: 'test-metadata-provider',
              id: 'track-1',
            },
          },
          {
            title: 'King of California',
            artists: [
              {
                name: 'John Butler',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            source: {
              provider: 'test-metadata-provider',
              id: 'track-2',
            },
          },
        ],
        releaseDate: {
          precision: 'year',
          dateIso: '2025-01-01',
        },
        genres: ['Folk', 'World', 'Country'],
        artwork: {
          items: [
            {
              url: 'https://img/album-cover.jpg',
              purpose: 'cover',
              width: 600,
            },
          ],
        },
        source: {
          provider: 'test-metadata-provider',
          id: 'test-album-id',
        },
      }))
      .build();

    providersServiceHost.register(provider);
  });

  it('(Snapshot) renders the album view', async () => {
    const component = await AlbumWrapper.mount('Prism');
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('shows loading states for album details and tracks', async () => {
    providersServiceHost.clear();
    const delay = () => {
      return new Promise<never>(() => {});
    };
    const provider = new MetadataProviderBuilder()
      .withId('query-cache-busted')
      .withName('The provider that never resolves')
      .withSearchCapabilities(['unified', 'albums'])
      .withAlbumMetadataCapabilities(['albumDetails'])
      .withSearch(async () => ({
        albums: [
          {
            title: 'Test Album',
            artists: [
              {
                name: 'Test Artist',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            source: {
              provider: 'test-metadata-provider',
              id: 'test-album-id',
            },
          },
        ],
      }))
      .withFetchAlbumDetails(delay)
      .build();
    providersServiceHost.register(provider);

    await AlbumWrapper.mountNoWait();

    expect(
      await screen.findByTestId('album-header-loader'),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('album-tracks-loader'),
    ).toBeInTheDocument();
  });
});
