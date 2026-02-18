import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { DashboardProviderBuilder } from '../../test/builders/DashboardProviderBuilder';
import {
  EDITORIAL_PLAYLISTS_DASHBOARD,
  NEW_RELEASES_DASHBOARD,
  TOP_ALBUMS_DASHBOARD,
  TOP_ARTISTS_DASHBOARD,
  TOP_TRACKS_RADIOHEAD,
} from '../../test/fixtures/dashboard';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';

export const DashboardWrapper = {
  reset() {
    providersHost.clear();
    resetInMemoryTauriStore();
  },

  seedProvider(builder: DashboardProviderBuilder) {
    providersHost.register(builder.build());
  },

  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/dashboard'] });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('dashboard-view');
    return component;
  },

  get emptyState() {
    return screen.queryByTestId('dashboard-empty-state');
  },

  topTracks: {
    get heading() {
      return screen.queryByRole('heading', { name: /top tracks/i });
    },
    get table() {
      return screen.queryByTestId('dashboard-top-tracks');
    },
    async findTable() {
      return screen.findByTestId('dashboard-top-tracks');
    },
    track(title: string) {
      const table = screen.getByTestId('dashboard-top-tracks');
      return within(table).queryByText(title);
    },
    async findTrack(title: string) {
      const table = await screen.findByTestId('dashboard-top-tracks');
      return within(table).findByText(title);
    },
  },

  topArtists: {
    get heading() {
      return screen.queryByRole('heading', { name: /top artists/i });
    },
    artist(name: string) {
      const section = screen.getByTestId('dashboard-top-artists');
      return within(section).queryByText(name);
    },
    async findArtist(name: string) {
      const section = await screen.findByTestId('dashboard-top-artists');
      return within(section).findByText(name);
    },
  },

  topAlbums: {
    get section() {
      return screen.queryByTestId('dashboard-top-albums');
    },
    get heading() {
      return screen.queryByRole('heading', { name: /top albums/i });
    },
    async findAlbum(title: string) {
      const section = await screen.findByTestId('dashboard-top-albums');
      return within(section).findByText(title);
    },
  },

  editorialPlaylists: {
    get section() {
      return screen.queryByTestId('dashboard-editorial-playlists');
    },
    get heading() {
      return screen.queryByRole('heading', { name: /top playlists/i });
    },
    async findPlaylist(name: string) {
      const section = await screen.findByTestId(
        'dashboard-editorial-playlists',
      );
      return within(section).findByText(name);
    },
  },

  newReleases: {
    get section() {
      return screen.queryByTestId('dashboard-new-releases');
    },
    get heading() {
      return screen.queryByRole('heading', { name: /new releases/i });
    },
    async findRelease(title: string) {
      const section = await screen.findByTestId('dashboard-new-releases');
      return within(section).findByText(title);
    },
  },

  fixtures: {
    topTracksProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('topTracks')
        .withFetchTopTracks(async () => TOP_TRACKS_RADIOHEAD);
    },
    topTracksAndArtistsProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('topTracks', 'topArtists')
        .withFetchTopTracks(async () => TOP_TRACKS_RADIOHEAD)
        .withFetchTopArtists(async () => TOP_ARTISTS_DASHBOARD);
    },
    topAlbumsProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('topAlbums')
        .withFetchTopAlbums(async () => TOP_ALBUMS_DASHBOARD);
    },
    editorialPlaylistsProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('editorialPlaylists')
        .withFetchEditorialPlaylists(async () => EDITORIAL_PLAYLISTS_DASHBOARD);
    },
    newReleasesProvider() {
      return new DashboardProviderBuilder()
        .withId('acme-dashboard')
        .withName('Acme Music')
        .withCapabilities('newReleases')
        .withFetchNewReleases(async () => NEW_RELEASES_DASHBOARD);
    },
  },
};
