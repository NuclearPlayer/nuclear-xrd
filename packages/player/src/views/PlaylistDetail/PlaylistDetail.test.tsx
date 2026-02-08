import { PlaylistBuilder } from '../../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { PlaylistDetailWrapper } from './PlaylistDetail.test-wrapper';

const defaultPlaylist = () =>
  new PlaylistBuilder()
    .withId('test-playlist')
    .withName('Test Playlist')
    .withTrackCount(2);

describe('PlaylistDetail view', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    PlaylistDetailWrapper.seedPlaylist(defaultPlaylist());
  });

  it('displays the playlist name', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.title).toHaveTextContent('Test Playlist');
  });

  it('displays the track count', async () => {
    await PlaylistDetailWrapper.mount('test-playlist');

    expect(PlaylistDetailWrapper.trackCount).toHaveTextContent('2 tracks');
  });
});
