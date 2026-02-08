import { usePlaylistStore } from '../../stores/playlistStore';
import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { PlaylistDetailWrapper } from './PlaylistDetail.test-wrapper';

const testPlaylist = new PlaylistBuilder()
  .withId('test-playlist')
  .withName('Test Playlist')
  .withTrackCount(2)
  .build();

describe('PlaylistDetail view', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    usePlaylistStore.setState({
      index: [
        new PlaylistBuilder()
          .withId('test-playlist')
          .withName('Test Playlist')
          .withTrackCount(2)
          .buildIndexEntry(),
      ],
      playlists: new Map([['test-playlist', testPlaylist]]),
      loaded: true,
    });
  });

  it('displays the playlist name', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.title).toHaveTextContent('Test Playlist');
  });
});
