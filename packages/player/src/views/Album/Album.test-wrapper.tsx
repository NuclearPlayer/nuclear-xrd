import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
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
  async mountDirectly(
    url: string = '/album/test-metadata-provider/album-1',
  ): Promise<RenderResult> {
    const component = render(<App />);
    history.pushState({}, '', url);
    await screen.findByTestId('album-view');

    return component;
  },
  getHeader: (name: string) => screen.getByRole('heading', { name }),
  getTracksTable: () => screen.queryByRole('table'),
  getTracks: () => screen.queryAllByTestId('track-row'),
  addTrackToQueueByTitle: async (title: string) => {
    const allTracks = screen.getAllByTestId('track-row');
    const trackRow = allTracks.find((row) => row.textContent?.includes(title));
    await userEvent.click(within(trackRow!).getByTestId('add-to-queue-button'));
  },
};
