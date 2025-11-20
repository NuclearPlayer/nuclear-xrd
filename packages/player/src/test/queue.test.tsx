import { screen } from '@testing-library/react';

import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queue/queue.store';
import { AlbumWrapper } from '../views/Album/Album.test-wrapper';
import { MetadataProviderBuilder } from './builders/MetadataProviderBuilder';
import { QueueWrapper } from './Queue.test-wrapper';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('./utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

describe('Queue', () => {
  beforeEach(() => {
    useQueueStore.setState({
      items: [],
      currentIndex: 0,
      repeatMode: 'off',
      shuffleEnabled: false,
      isReady: true,
      isLoading: false,
    });

    providersHost.clear();
    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities(['unified', 'albums'])
      .withAlbumMetadataCapabilities(['albumDetails'])
      .withFetchAlbumDetails(async () => ({
        title: 'Giant Steps',
        artists: [
          {
            name: 'John Coltrane',
            roles: [],
          },
        ],
        tracks: [
          {
            title: 'Countdown',
            artists: [
              {
                name: 'John Coltrane',
                roles: [],
                source: { provider: 'test-metadata-provider', id: 'artist-1' },
              },
            ],
            source: { provider: 'test-metadata-provider', id: 'track-1' },
          },
          {
            title: 'Giant Steps',
            artists: [
              {
                name: 'John Coltrane',
                roles: [],
                source: { provider: 'test-metadata-provider', id: 'artist-1' },
              },
            ],
            source: { provider: 'test-metadata-provider', id: 'track-2' },
          },
        ],
        source: { provider: 'test-metadata-provider', id: 'album-1' },
      }))
      .build();

    providersHost.register(provider);
  });

  it('should display an empty queue', async () => {
    await AlbumWrapper.mountDirectly();
    const items = QueueWrapper.getItems();
    expect(items).toHaveLength(0);
    expect(await screen.findByText('Queue is empty')).toBeInTheDocument();
    expect(
      await screen.findByText('Add tracks to start playing'),
    ).toBeInTheDocument();
  });

  it('should add album tracks to the queue', async () => {
    await AlbumWrapper.mountDirectly();
    await AlbumWrapper.addTrackToQueueByTitle('Countdown');
    expect(QueueWrapper.getItems()).toMatchInlineSnapshot(`
      [
        {
          "artist": "John Coltrane",
          "duration": undefined,
          "error": undefined,
          "title": "Countdown",
        },
      ]
    `);
  });

  it('should select track on double click', async () => {
    await AlbumWrapper.mountDirectly();
    await AlbumWrapper.addTrackToQueueByTitle('Countdown');
    await AlbumWrapper.addTrackToQueueByTitle('Giant Steps');

    await QueueWrapper.selectItem('Giant Steps');

    expect(QueueWrapper.getCurrentItemIndex()).toBe(1);
  });

  it('should remove track when clicking X button', async () => {
    await AlbumWrapper.mountDirectly();
    await AlbumWrapper.addTrackToQueueByTitle('Countdown');
    expect(QueueWrapper.getItems()).toHaveLength(1);
    await QueueWrapper.removeItemByTitle('Countdown');
    expect(QueueWrapper.getItems()).toHaveLength(0);
  });
});
