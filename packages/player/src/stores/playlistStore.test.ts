import { playlistIndexStore } from '../services/playlistFileService';
import { PlaylistBuilder } from '../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { createMockTrack } from '../test/utils/mockTrack';
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

  it('creates a new empty playlist', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('My Playlist');

    expect(id).toBeDefined();
    expect(usePlaylistStore.getState().index).toMatchInlineSnapshot(`
      [
        {
          "createdAtIso": "2026-01-01T00:00:00.000Z",
          "id": "mock-uuid-0",
          "isReadOnly": false,
          "itemCount": 0,
          "lastModifiedIso": "2026-01-01T00:00:00.000Z",
          "name": "My Playlist",
          "totalDurationMs": 0,
        },
      ]
    `);
    expect(usePlaylistStore.getState().playlists.get(id))
      .toMatchInlineSnapshot(`
      {
        "createdAtIso": "2026-01-01T00:00:00.000Z",
        "id": "mock-uuid-0",
        "isReadOnly": false,
        "items": [],
        "lastModifiedIso": "2026-01-01T00:00:00.000Z",
        "name": "My Playlist",
      }
    `);
  });

  it('deletes a playlist from index and cache', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('To Delete');
    await usePlaylistStore.getState().deletePlaylist(id);

    expect(usePlaylistStore.getState().index).toHaveLength(0);
    expect(usePlaylistStore.getState().playlists.has(id)).toBe(false);
  });

  it('adds tracks to a playlist', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('My Playlist');
    const track = createMockTrack('New Song');

    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
    await usePlaylistStore.getState().addTracks(id, [track]);

    const updated = usePlaylistStore.getState().playlists.get(id);
    expect(updated?.items).toHaveLength(1);
    expect(updated?.items[0].track.title).toBe('New Song');
    expect(updated?.items[0].addedAtIso).toBe('2026-06-15T12:00:00.000Z');
    expect(updated?.lastModifiedIso).toBe('2026-06-15T12:00:00.000Z');
  });

  it('does nothing when adding tracks to a nonexistent playlist', async () => {
    const track = createMockTrack('Orphan');

    await usePlaylistStore.getState().addTracks('nonexistent', [track]);

    expect(usePlaylistStore.getState().index).toHaveLength(0);
    expect(usePlaylistStore.getState().playlists.size).toBe(0);
  });

  it('removes tracks by item IDs', async () => {
    const id = await usePlaylistStore.getState().createPlaylist('My Playlist');
    const trackA = createMockTrack('Song A');
    const trackB = createMockTrack('Song B');
    const items = await usePlaylistStore
      .getState()
      .addTracks(id, [trackA, trackB]);

    await usePlaylistStore.getState().removeTracks(id, [items[0].id]);

    const updated = usePlaylistStore.getState().playlists.get(id);
    expect(updated?.items).toHaveLength(1);
    expect(updated?.items[0].track.title).toBe('Song B');
  });

  it('loads index from file service', async () => {
    const playlist = new PlaylistBuilder().withTrackCount(2).build();
    await playlistIndexStore.upsert(playlist);

    await usePlaylistStore.getState().loadIndex();

    expect(usePlaylistStore.getState().index).toHaveLength(1);
    expect(usePlaylistStore.getState().loaded).toBe(true);
  });
});
