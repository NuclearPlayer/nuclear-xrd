import { RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchWrapper } from '../Search/Search.test-wrapper';

export const ArtistWrapper = {
  async mount(header: string): Promise<RenderResult> {
    const component = await SearchWrapper.mount('test artist');
    await userEvent.click(component.getByText('Test Artist'));
    await screen.findByText(header);
    return component;
  },
  async mountNoWait(): Promise<RenderResult> {
    const component = await SearchWrapper.mount('test artist');
    await userEvent.click(component.getByText('Test Artist'));
    await new Promise((r) => setTimeout(r, 0));
    return component;
  },
  getHeader: (name: string) => screen.getByRole('heading', { name }),
  getPopularTracksSection: () =>
    screen.getByRole('heading', { name: /popular tracks/i }),
  getSimilarArtistsSection: () =>
    screen.getByRole('heading', { name: /similar artists/i }),
  getAlbumsGrid: () => screen.getByTestId('artist-albums-grid'),
  getAlbums: () => screen.queryAllByTestId('card'),
  getSimilarArtistItems: () => screen.queryAllByRole('listitem'),
  getTracksTable: () => screen.queryByRole('table'),
  expectSimilarArtistItem(li: HTMLElement) {
    const utils = within(li);
    const img = utils.queryByRole('img');
    const name = utils.getByText(/.+/);
    return { img, name };
  },
};
