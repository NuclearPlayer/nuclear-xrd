import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DialogWrapper } from '@nuclearplayer/ui';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';

const user = userEvent.setup();

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
  async clickCard(index: number) {
    const cards = screen.getAllByTestId('card');
    await user.click(cards[index]);
  },
  get detailView() {
    return screen.queryByTestId('playlist-detail-view');
  },

  createButton: {
    get element() {
      return screen.getByTestId('create-playlist-button');
    },
    async click() {
      await user.click(this.element);
    },
  },

  createDialog: {
    isOpen: () => DialogWrapper.isOpen(),
    get nameInput() {
      return screen.getByTestId('playlist-name-input');
    },
    async typeName(name: string) {
      await user.type(this.nameInput, name);
    },
    submitButton: {
      get element() {
        return DialogWrapper.getByText('Create new');
      },
      async click() {
        await user.click(this.element);
      },
    },
    async createPlaylist(name: string) {
      await PlaylistsWrapper.createDialog.typeName(name);
      await PlaylistsWrapper.createDialog.submitButton.click();
    },
  },
};
