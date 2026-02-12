import { screen } from '@testing-library/react';

import { PlayerBarWrapper } from '../../integration-tests/PlayerBar.test-wrapper';
import { QueueWrapper } from '../../integration-tests/Queue.test-wrapper';
import { useQueueStore } from '../../stores/queueStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { mockUuid } from '../../test/utils/mockUuid';
import { PlaylistDetailWrapper } from './PlaylistDetail.test-wrapper';

const defaultPlaylist = () =>
  new PlaylistBuilder()
    .withId('test-playlist')
    .withName('Test Playlist')
    .withTrackNames(['Giant Steps', 'So What']);

describe('PlaylistDetail view', () => {
  beforeEach(() => {
    mockUuid.reset();
    resetInMemoryTauriStore();
    useQueueStore.setState({ items: [], currentIndex: 0 });
    PlaylistDetailWrapper.seedPlaylist(defaultPlaylist());
  });

  it('(Snapshot) renders playlist detail with tracks', async () => {
    const { getByTestId } = await PlaylistDetailWrapper.mount('test-playlist');

    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('displays the playlist name', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.title).toHaveTextContent('Test Playlist');
  });

  it('displays the track count', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.trackCount).toHaveTextContent('2 tracks');
  });

  it('shows read-only badge for external playlists', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder()
        .withId('external-playlist')
        .withName('External Playlist')
        .readOnly()
        .withOrigin({ provider: 'spotify', id: 'ext-1' })
        .withTrackNames(['Track A']),
    );

    await PlaylistDetailWrapper.mount('external-playlist');

    expect(PlaylistDetailWrapper.readOnlyBadge).toBeInTheDocument();
  });

  it('deletes playlist and navigates back to playlists list', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    await PlaylistDetailWrapper.deleteDialog.openFromActions();
    expect(PlaylistDetailWrapper.deleteDialog.isOpen()).toBe(true);

    await PlaylistDetailWrapper.deleteDialog.confirmButton.click();

    await vi.waitFor(() => {
      expect(PlaylistDetailWrapper.playlistsListView).toBeInTheDocument();
    });
  });

  it('adds all tracks to queue and plays', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    await PlaylistDetailWrapper.playButton.click();

    const queueItems = QueueWrapper.getItems();
    expect(queueItems).toHaveLength(2);
    expect(queueItems[0]?.title).toBe('Giant Steps');
    expect(queueItems[1]?.title).toBe('So What');
    expect(PlayerBarWrapper.isPlaying).toBe(true);
  });

  it('shows empty state when playlist has no tracks', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder().withId('empty-playlist').withName('Empty Playlist'),
    );

    await PlaylistDetailWrapper.mount('empty-playlist');

    expect(PlaylistDetailWrapper.emptyState).toBeInTheDocument();
    expect(PlaylistDetailWrapper.trackTable).not.toBeInTheDocument();
  });

  it('removes a track from the playlist when clicking the delete button', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.trackTitle('Giant Steps')).toBeInTheDocument();
    expect(PlaylistDetailWrapper.trackTitle('So What')).toBeInTheDocument();
    expect(PlaylistDetailWrapper.removeButtons).toHaveLength(2);

    await PlaylistDetailWrapper.removeTrack('Giant Steps');

    await vi.waitFor(() => {
      expect(
        PlaylistDetailWrapper.trackTitle('Giant Steps'),
      ).not.toBeInTheDocument();
    });
    expect(PlaylistDetailWrapper.trackTitle('So What')).toBeInTheDocument();
    expect(PlaylistDetailWrapper.trackCount).toHaveTextContent('1 track');
  });

  it('does not show remove buttons for read-only playlists', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder()
        .withId('readonly-playlist')
        .withName('Read-Only Playlist')
        .readOnly()
        .withOrigin({ provider: 'spotify', id: 'ext-1' })
        .withTrackNames(['Track A', 'Track B']),
    );

    await PlaylistDetailWrapper.mount('readonly-playlist');

    expect(PlaylistDetailWrapper.trackTable).toBeInTheDocument();
    expect(PlaylistDetailWrapper.removeButtons).toHaveLength(0);
  });

  it('enables reorder for editable playlists', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    const rows = screen.getAllByTestId('track-row');
    expect(rows[0]).toHaveAttribute('aria-disabled', 'false');
  });

  it('does not enable reorder for read-only playlists', async () => {
    PlaylistDetailWrapper.seedPlaylist(
      new PlaylistBuilder()
        .withId('readonly-playlist')
        .withName('Read-Only')
        .readOnly()
        .withOrigin({ provider: 'spotify', id: 'ext-1' })
        .withTrackNames(['Track A', 'Track B']),
    );

    await PlaylistDetailWrapper.mount('readonly-playlist');

    const rows = screen.getAllByTestId('track-row');
    expect(rows[0]).toHaveAttribute('aria-disabled', 'true');
  });

  it('adds all tracks to queue without clearing', async () => {
    useQueueStore.getState().addToQueue([
      {
        title: 'Existing Track',
        artists: [],
        source: { provider: 'test', id: 'existing' },
      },
    ]);

    await PlaylistDetailWrapper.mount('test-playlist');

    await PlaylistDetailWrapper.addToQueueFromActions();

    const queueItems = QueueWrapper.getItems();
    expect(queueItems).toHaveLength(3);
    expect(queueItems[0]?.title).toBe('Existing Track');
    expect(queueItems[1]?.title).toBe('Giant Steps');
    expect(queueItems[2]?.title).toBe('So What');
  });
});
