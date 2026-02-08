import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';

export const PlaylistsWrapper = {
  async mount(): Promise<RenderResult> {
    const history = createMemoryHistory({ initialEntries: ['/playlists'] });
    const router = createRouter({ routeTree, history });
    const component = render(<App routerProp={router} />);
    await screen.findByTestId('playlists-view');
    return component;
  },

  get emptyState() {
    return screen.queryByTestId('empty-state');
  },
  get cards() {
    return screen.queryAllByTestId('card');
  },
};
