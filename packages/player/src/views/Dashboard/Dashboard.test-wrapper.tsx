import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen, within } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { DashboardProviderBuilder } from '../../test/builders/DashboardProviderBuilder';
import {
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
  },
};
