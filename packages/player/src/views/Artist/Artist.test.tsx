import { screen } from '@testing-library/react';

import { providersServiceHost } from '../../services/providersService';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { ArtistWrapper } from './Artist.test-wrapper';

describe('Artist view', () => {
  beforeEach(() => {
    providersServiceHost.clear();
    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities(['unified', 'artists'])
      .withArtistMetadataCapabilities([
        'artistDetails',
        'artistAlbums',
        'artistTopTracks',
        'artistRelatedArtists',
      ])
      .withSearch(async () => ({
        artists: [
          {
            name: 'Test Artist',
            artwork: {
              items: [
                {
                  url: 'https://img/avatar.jpg',
                  purpose: 'avatar',
                  width: 300,
                },
                { url: 'https://img/cover.jpg', purpose: 'cover', width: 1200 },
              ],
            },
            source: {
              provider: 'test-metadata-provider',
              id: 'test-artist-id',
            },
          },
        ],
      }))
      .withFetchArtistDetails(async () => ({
        name: 'The Beatles',
        onTour: true,
        tags: ['rock', 'indie', 'brit-pop'],
        artwork: {
          items: [
            { url: 'https://img/avatar.jpg', purpose: 'avatar', width: 300 },
            { url: 'https://img/cover.jpg', purpose: 'cover', width: 1200 },
          ],
        },
        source: { provider: 'test-metadata-provider', id: 'test-artist-id' },
      }))
      .withFetchArtistAlbums(async () => [
        {
          title: 'Hello World LP',
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
              { url: 'https://img/debut.jpg', purpose: 'cover', width: 300 },
            ],
          },
          source: { provider: 'test-metadata-provider', id: 'album-1' },
        },
      ])
      .withFetchArtistTopTracks(async () => [
        {
          title: 'Smells Like Cheap Spirit',
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
              { url: 'https://img/track.jpg', purpose: 'thumbnail', width: 64 },
            ],
          },
          source: { provider: 'test-metadata-provider', id: 'track-1' },
        },
      ])
      .withFetchArtistRelatedArtists(async () => [
        {
          name: 'John Lennon',
          artwork: {
            items: [
              { url: 'https://img/similar1.jpg', purpose: 'avatar', width: 64 },
            ],
          },
          source: { provider: 'test-metadata-provider', id: 'artist-2' },
        },
        {
          name: 'Kurt Cobain',
          artwork: {
            items: [
              { url: 'https://img/similar2.jpg', purpose: 'avatar', width: 64 },
            ],
          },
          source: { provider: 'test-metadata-provider', id: 'artist-3' },
        },
      ])
      .build();

    providersServiceHost.register(provider);
  });

  it('(Snapshot) renders the artist view', async () => {
    const component = await ArtistWrapper.mount('The Beatles');
    expect(component.asFragment()).toMatchSnapshot();
  });

  it.skip('(Snapshot) renders artist view with details, popular tracks, similar artists, and albums', async () => {
    await ArtistWrapper.mount('The Beatles');
    const header = ArtistWrapper.getHeader('The Beatles');
    expect(header).toBeInTheDocument();

    const tracksTable = ArtistWrapper.getTracksTable();
    expect(tracksTable).toMatchSnapshot();

    const similar = ArtistWrapper.getSimilarArtistItems();
    expect(similar).toMatchSnapshot();

    const albums = ArtistWrapper.getAlbums();
    expect(albums).toMatchSnapshot();
  });

  it('shows loading states for details, top tracks, related artists, and albums', async () => {
    providersServiceHost.clear();
    const delay = () => {
      return new Promise<never>(() => {});
    };
    const provider = new MetadataProviderBuilder()
      .withId('query-cache-busted')
      .withName('The provider that never resolves')
      .withSearchCapabilities(['unified', 'artists'])
      .withArtistMetadataCapabilities([
        'artistDetails',
        'artistAlbums',
        'artistTopTracks',
        'artistRelatedArtists',
      ])
      .withSearch(async () => ({
        artists: [
          {
            name: 'Test Artist',
            source: {
              provider: 'test-metadata-provider',
              id: 'test-artist-id',
            },
          },
        ],
      }))
      .withFetchArtistDetails(delay)
      .withFetchArtistAlbums(delay)
      .withFetchArtistTopTracks(delay)
      .withFetchArtistRelatedArtists(delay)
      .build();
    providersServiceHost.register(provider);

    await ArtistWrapper.mountNoWait();

    expect(
      await screen.findByTestId('artist-header-loader'),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('artist-albums-loader'),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('popular-tracks-loader'),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('similar-artists-loader'),
    ).toBeInTheDocument();
  });
});
