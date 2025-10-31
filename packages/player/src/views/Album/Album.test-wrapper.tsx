import { RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchWrapper } from '../Search/Search.test-wrapper';

export const AlbumWrapper = {
  async mount(header: string): Promise<RenderResult> {
    const component = await SearchWrapper.mount('test album');
    const albums = await screen.findAllByTestId('card');
    if (albums.length === 0) {
      throw new Error('No albums found in search results');
    }
    await userEvent.click(albums[0]!);
    await screen.findByText(header);
    return component;
  },
  async mountNoWait(): Promise<RenderResult> {
    const component = await SearchWrapper.mount('test album');
    const albums = await screen.findAllByTestId('card');
    if (albums.length === 0) {
      throw new Error('No albums found in search results');
    }
    await userEvent.click(albums[0]!);
    await new Promise((r) => setTimeout(r, 0));
    return component;
  },
  getHeader: (name: string) => screen.getByRole('heading', { name }),
  getTracksTable: () => screen.queryByRole('table'),
};
