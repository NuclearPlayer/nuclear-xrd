import { playlistIndexStore } from '../services/playlistFileService';
import { PlaylistBuilder } from '../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { mockUuid } from '../test/utils/mockUuid';
import { usePlaylistStore } from './playlistStore';

const resetStore = () => {
  usePlaylistStore.setState({
    index: [],
    playlists: new Map(),
    loaded: false,
  });
};

describe('playlistStore', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    mockUuid.reset();
    resetInMemoryTauriStore();
    resetStore();
  });

  it('loads index from file service', async () => {
    const playlist = new PlaylistBuilder().withTrackCount(2).build();
    await playlistIndexStore.upsert(playlist);

    await usePlaylistStore.getState().loadIndex();

    expect(usePlaylistStore.getState().index).toHaveLength(1);
    expect(usePlaylistStore.getState().loaded).toBe(true);
  });
});
