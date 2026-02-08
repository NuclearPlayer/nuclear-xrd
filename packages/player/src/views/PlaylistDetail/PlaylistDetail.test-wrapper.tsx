import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { usePlaylistStore } from '../../stores/playlistStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';

export const PlaylistDetailWrapper = {
  seedPlaylist(builder: PlaylistBuilder) {
    const playlist = builder.build();
    usePlaylistStore.setState({
      index: [builder.buildIndexEntry()],
      playlists: new Map([[playlist.id, playlist]]),
      loaded: true,
    });
  },

  async mount(playlistId: string): Promise<RenderResult> {
    const history = createMemoryHistory({
      initialEntries: [`/playlists/${playlistId}`],
    });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('playlist-detail-view');
    return component;
  },

  get title() {
    return screen.queryByTestId('playlist-detail-title');
  },
  get trackCount() {
    return screen.queryByTestId('playlist-detail-track-count');
  },
  get trackTable() {
    return screen.queryByRole('table');
  },
  trackTitle(name: string) {
    return screen.queryByText(name);
  },
  get readOnlyBadge() {
    return screen.queryByTestId('read-only-badge');
  },
  get emptyState() {
    return screen.queryByTestId('empty-state');
  },
};
