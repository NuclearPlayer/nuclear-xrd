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
