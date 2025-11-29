import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const QueueWrapper = {
  getItems: () => {
    const itemElements = screen.queryAllByTestId('queue-item');
    return itemElements.map((itemElement) => ({
      title: within(itemElement).getByTestId('queue-item-title').textContent,
      artist: within(itemElement).getByTestId('queue-item-artist').textContent,
      duration: within(itemElement).queryByTestId('queue-item-duration')
        ?.textContent,
      error: within(itemElement).queryByTestId('queue-item-error')?.textContent,
    }));
  },
  waitForItems: async (count: number) => {
    await waitFor(() => {
      const items = screen.queryAllByTestId('queue-item');
      expect(items).toHaveLength(count);
    });
  },
  getCurrentItemIndex: () => {
    const allTracks = screen.queryAllByTestId('queue-item');
    const currentTrackIndex = allTracks.findIndex(
      (item) => item.getAttribute('data-is-current') === 'true',
    );
    return currentTrackIndex;
  },
  selectItem: async (title: string) => {
    const queuePanel = await screen.findByTestId('queue-panel');
    const items = await within(queuePanel).findAllByTestId('queue-item');
    const item = items.find((itemElement) =>
      itemElement.textContent?.includes(title),
    );

    await userEvent.dblClick(item!);
  },

  removeItemByTitle: async (title: string) => {
    const allItems = screen.queryAllByTestId('queue-item');
    const item = allItems.find((itemElement) =>
      itemElement.textContent?.includes(title),
    );
    const removeButton = within(item!).getByTestId('queue-item-remove-button');
    await userEvent.click(removeButton);
  },
};
