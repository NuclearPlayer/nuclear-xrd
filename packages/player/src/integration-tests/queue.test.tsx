import { screen } from '@testing-library/react';

import { providersHost } from '../services/providersHost';
import { useQueueStore } from '../stores/queue/queue.store';
import { useSettingsStore } from '../stores/settingsStore';
import { MetadataProviderBuilder } from '../test/builders/MetadataProviderBuilder';
import {
  createMockCandidate,
  createMockStream,
  StreamingProviderBuilder,
} from '../test/builders/StreamingProviderBuilder';
import { GIANT_STEPS } from '../test/fixtures/albums';
import { AlbumWrapper } from '../views/Album/Album.test-wrapper';
import { QueueWrapper } from './Queue.test-wrapper';

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

    useSettingsStore.getState().setValue('playback.streamExpiryMs', 3600000);
    useSettingsStore.getState().setValue('playback.streamResolutionRetries', 3);

    providersHost.clear();

    const metadataProvider = new MetadataProviderBuilder()
      .withSearchCapabilities(['unified', 'albums'])
      .withAlbumMetadataCapabilities(['albumDetails'])
      .withFetchAlbumDetails(async () => GIANT_STEPS)
      .build();
    providersHost.register(metadataProvider);

    const streamingProvider = new StreamingProviderBuilder()
      .withSearchForTrack(async (artist, title) => [
        createMockCandidate(`yt-${title}`, `${artist} - ${title}`),
      ])
      .withGetStreamUrl(async (candidateId) => createMockStream(candidateId))
      .build();
    providersHost.register(streamingProvider);
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
    await QueueWrapper.waitForItems(1);
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
    await QueueWrapper.waitForItems(1);
    expect(QueueWrapper.getItems()).toHaveLength(1);
    await QueueWrapper.removeItemByTitle('Countdown');
    await QueueWrapper.waitForItems(0);
    expect(QueueWrapper.getItems()).toHaveLength(0);
  });
});
