import { usePlaylistStore } from '../../stores/playlistStore';
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
});
