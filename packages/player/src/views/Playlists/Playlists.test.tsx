import { usePlaylistStore } from '../../stores/playlistStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { PlaylistsWrapper } from './Playlists.test-wrapper';

describe('Playlists view', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    usePlaylistStore.setState({
      index: [],
      playlists: new Map(),
      loaded: true,
    });
  });

  it('shows empty state when no playlists', async () => {
    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.emptyState).toBeInTheDocument();
  });

  it('renders playlist cards when playlists exist', async () => {
    usePlaylistStore.setState({
      index: [
        new PlaylistBuilder()
          .withName('Rock Classics')
          .withTrackCount(10)
          .buildIndexEntry(),
        new PlaylistBuilder()
          .withName('Chill Vibes')
          .withTrackCount(8)
          .buildIndexEntry(),
      ],
      loaded: true,
    });

    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.emptyState).not.toBeInTheDocument();
    expect(PlaylistsWrapper.cards).toMatchSnapshot();
  });

  it('opens create dialog when clicking create button', async () => {
    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.createButton.click();

    expect(PlaylistsWrapper.createDialog.isOpen()).toBe(true);
  });

  it('creates a playlist and adds it to the list', async () => {
    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.createButton.click();
    await PlaylistsWrapper.createDialog.createPlaylist('My New Playlist');

    expect(PlaylistsWrapper.createDialog.isOpen()).toBe(false);
    expect(usePlaylistStore.getState().index).toHaveLength(1);
    expect(usePlaylistStore.getState().index[0]?.name).toBe('My New Playlist');
  });

  it('navigates to playlist detail when clicking a card', async () => {
    usePlaylistStore.setState({
      index: [
        new PlaylistBuilder()
          .withId('nav-test')
          .withName('Navigate Me')
          .withTrackCount(3)
          .buildIndexEntry(),
      ],
      playlists: new Map([
        [
          'nav-test',
          new PlaylistBuilder()
            .withId('nav-test')
            .withName('Navigate Me')
            .withTrackCount(3)
            .build(),
        ],
      ]),
      loaded: true,
    });

    await PlaylistsWrapper.mount();
    await PlaylistsWrapper.clickCard(0);

    expect(PlaylistsWrapper.detailView).toBeInTheDocument();
  });
});
