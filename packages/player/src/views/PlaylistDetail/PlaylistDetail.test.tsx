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
});
