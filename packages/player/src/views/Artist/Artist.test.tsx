import { screen } from '@testing-library/react';

import { providersHost } from '../../services/providersHost';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { ArtistWrapper } from './Artist.test-wrapper';

const searchResult = async () => ({
  artists: [
    {
      name: 'Test Artist',
      artwork: {
        items: [
          {
            url: 'https://img/avatar.jpg',
            purpose: 'avatar' as const,
            width: 300,
          },
          {
            url: 'https://img/cover.jpg',
            purpose: 'cover' as const,
            width: 1200,
          },
        ],
      },
      source: {
        provider: 'test-metadata-provider',
        id: 'test-artist-id',
      },
    },
  ],
});

const resetStores = () => {
  providersHost.clear();
  resetInMemoryTauriStore();
  useFavoritesStore.setState({
    tracks: [],
    albums: [],
    artists: [],
    loaded: true,
  });
};

describe('Artist view', () => {
  describe('with bio provider', () => {
    beforeEach(() => {
      resetStores();
      const provider = new MetadataProviderBuilder()
        .withSearchCapabilities(['unified', 'artists'])
        .withArtistMetadataCapabilities([
          'artistBio',
          'artistAlbums',
          'artistTopTracks',
          'artistRelatedArtists',
        ])
        .withAlbumMetadataCapabilities(['albumDetails'])
        .withSearch(searchResult)
        .withFetchArtistBio(async () => ({
          name: 'The Beatles',
          onTour: true,
          tags: ['rock', 'indie', 'brit-pop'],
          artwork: {
            items: [
              { url: 'https://img/avatar.jpg', purpose: 'avatar', width: 300 },
              { url: 'https://img/cover.jpg', purpose: 'cover', width: 1200 },
            ],
          },
          source: {
            provider: 'test-metadata-provider',
            id: 'test-artist-id',
          },
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
                {
                  url: 'https://img/track.jpg',
                  purpose: 'thumbnail',
                  width: 64,
                },
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
                {
                  url: 'https://img/similar1.jpg',
                  purpose: 'avatar',
                  width: 64,
                },
              ],
            },
            source: { provider: 'test-metadata-provider', id: 'artist-2' },
          },
          {
            name: 'Kurt Cobain',
            artwork: {
              items: [
                {
                  url: 'https://img/similar2.jpg',
                  purpose: 'avatar',
                  width: 64,
                },
              ],
            },
            source: { provider: 'test-metadata-provider', id: 'artist-3' },
          },
        ])
        .build();

      providersHost.register(provider);
    });

    it('(Snapshot) renders the artist view', async () => {
      const component = await ArtistWrapper.mount('The Beatles');
      expect(component.asFragment()).toMatchSnapshot();
    });

    it('shows loading states for bio, top tracks, related artists, and albums', async () => {
      providersHost.clear();
      const delay = () => new Promise<never>(() => {});
      const provider = new MetadataProviderBuilder()
        .withId('bio-never-resolves')
        .withName('Bio provider that never resolves')
        .withSearchCapabilities(['unified', 'artists'])
        .withArtistMetadataCapabilities([
          'artistBio',
          'artistAlbums',
          'artistTopTracks',
          'artistRelatedArtists',
        ])
        .withSearch(searchResult)
        .withFetchArtistBio(delay)
        .withFetchArtistAlbums(delay)
        .withFetchArtistTopTracks(delay)
        .withFetchArtistRelatedArtists(delay)
        .build();
      providersHost.register(provider);

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

    it('adds artist to favorites when clicking the heart button', async () => {
      vi.setSystemTime(new Date('2026-01-30T12:00:00.000Z'));
      await ArtistWrapper.mount('The Beatles');
      await ArtistWrapper.toggleFavorite();

      expect(useFavoritesStore.getState().artists).toMatchSnapshot();
    });

    it('removes artist from favorites when clicking the heart button again', async () => {
      await ArtistWrapper.mount('The Beatles');
      await ArtistWrapper.toggleFavorite();
      await ArtistWrapper.toggleFavorite();

      expect(useFavoritesStore.getState().artists).toHaveLength(0);
    });

    it('only renders widgets for capabilities the provider declares', async () => {
      providersHost.clear();
      const provider = new MetadataProviderBuilder()
        .withSearchCapabilities(['unified', 'artists'])
        .withArtistMetadataCapabilities(['artistBio', 'artistTopTracks'])
        .withSearch(searchResult)
        .withFetchArtistBio(async () => ({
          name: 'The Beatles',
          onTour: false,
          tags: [],
          artwork: { items: [] },
          source: {
            provider: 'test-metadata-provider',
            id: 'test-artist-id',
          },
        }))
        .withFetchArtistTopTracks(async () => [
          {
            title: 'Test Track',
            artists: [
              {
                name: 'Test Artist',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            source: { provider: 'test-metadata-provider', id: 'track-1' },
          },
        ])
        .build();
      providersHost.register(provider);

      await ArtistWrapper.mount('The Beatles');

      expect(
        screen.queryByTestId('artist-social-header'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('artist-albums-loader'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('similar-artists-loader'),
      ).not.toBeInTheDocument();
      expect(screen.queryAllByTestId('card')).toHaveLength(0);
    });
  });

  describe('with social stats provider', () => {
    beforeEach(() => {
      resetStores();
      const provider = new MetadataProviderBuilder()
        .withSearchCapabilities(['unified', 'artists'])
        .withArtistMetadataCapabilities([
          'artistSocialStats',
          'artistTopTracks',
          'artistPlaylists',
          'artistRelatedArtists',
        ])
        .withSearch(searchResult)
        .withFetchArtistSocialStats(async () => ({
          name: 'Deadmau5',
          artwork: {
            items: [
              { url: 'https://img/avatar.jpg', purpose: 'avatar', width: 300 },
            ],
          },
          city: 'Toronto',
          country: 'CA',
          followersCount: 5400000,
          followingsCount: 120,
          trackCount: 340,
          playlistCount: 22,
          source: {
            provider: 'test-metadata-provider',
            id: 'test-artist-id',
          },
        }))
        .withFetchArtistTopTracks(async () => [
          {
            title: 'Strobe',
            artists: [
              {
                name: 'Deadmau5',
                source: {
                  provider: 'test-metadata-provider',
                  id: 'test-artist-id',
                },
              },
            ],
            artwork: {
              items: [
                {
                  url: 'https://img/track.jpg',
                  purpose: 'thumbnail',
                  width: 64,
                },
              ],
            },
            source: { provider: 'test-metadata-provider', id: 'track-1' },
          },
        ])
        .withFetchArtistPlaylists(async () => [
          {
            id: 'playlist-1',
            name: 'mau5trap selects',
            artwork: {
              items: [
                {
                  url: 'https://img/playlist1.jpg',
                  purpose: 'cover',
                  width: 300,
                },
              ],
            },
            source: { provider: 'test-metadata-provider', id: 'playlist-1' },
          },
        ])
        .withFetchArtistRelatedArtists(async () => [
          {
            name: 'Skrillex',
            artwork: {
              items: [
                {
                  url: 'https://img/similar1.jpg',
                  purpose: 'avatar',
                  width: 64,
                },
              ],
            },
            source: { provider: 'test-metadata-provider', id: 'artist-2' },
          },
        ])
        .build();

      providersHost.register(provider);
    });

    it('(Snapshot) renders the artist view with social stats', async () => {
      const component = await ArtistWrapper.mount('Deadmau5');
      expect(component.asFragment()).toMatchSnapshot();
    });

    it('shows loading states for social stats, top tracks, playlists, and related artists', async () => {
      providersHost.clear();
      const delay = () => new Promise<never>(() => {});
      const provider = new MetadataProviderBuilder()
        .withId('social-never-resolves')
        .withName('Social provider that never resolves')
        .withSearchCapabilities(['unified', 'artists'])
        .withArtistMetadataCapabilities([
          'artistSocialStats',
          'artistTopTracks',
          'artistPlaylists',
          'artistRelatedArtists',
        ])
        .withSearch(searchResult)
        .withFetchArtistSocialStats(delay)
        .withFetchArtistTopTracks(delay)
        .withFetchArtistPlaylists(delay)
        .withFetchArtistRelatedArtists(delay)
        .build();
      providersHost.register(provider);

      await ArtistWrapper.mountNoWait();

      expect(
        await screen.findByTestId('artist-social-header-loader'),
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('popular-tracks-loader'),
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('artist-playlists-loader'),
      ).toBeInTheDocument();
      expect(
        await screen.findByTestId('similar-artists-loader'),
      ).toBeInTheDocument();
    });

    it('does not render bio header or albums grid', async () => {
      await ArtistWrapper.mount('Deadmau5');

      expect(
        screen.queryByTestId('artist-header-loader'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('artist-albums-loader'),
      ).not.toBeInTheDocument();
    });
  });
});
