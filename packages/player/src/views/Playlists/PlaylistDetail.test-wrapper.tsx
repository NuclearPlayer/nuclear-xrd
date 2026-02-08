import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';

export const PlaylistDetailWrapper = {
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
  get emptyState() {
    return screen.queryByTestId('empty-state');
  },
};
