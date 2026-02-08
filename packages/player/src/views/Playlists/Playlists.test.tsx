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

  it('renders playlist cards when playlists exist', async () => {
    usePlaylistStore.setState({
      index: [
        {
          id: 'p1',
          name: 'Rock Classics',
          createdAtIso: '2026-01-01T00:00:00.000Z',
          lastModifiedIso: '2026-01-01T00:00:00.000Z',
          isReadOnly: false,
          itemCount: 10,
          totalDurationMs: 1800000,
        },
        {
          id: 'p2',
          name: 'Chill Vibes',
          createdAtIso: '2026-01-02T00:00:00.000Z',
          lastModifiedIso: '2026-01-02T00:00:00.000Z',
          isReadOnly: false,
          itemCount: 8,
          totalDurationMs: 1440000,
        },
      ],
      loaded: true,
    });

    await PlaylistsWrapper.mount();

    expect(PlaylistsWrapper.emptyState).not.toBeInTheDocument();
    expect(PlaylistsWrapper.cards).toMatchSnapshot();
  });
});
