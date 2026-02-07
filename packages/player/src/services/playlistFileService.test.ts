import { PlaylistBuilder } from '../test/builders/PlaylistBuilder';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { mockUuid } from '../test/utils/mockUuid';
import { PlaylistFileStore, PlaylistIndexStore } from './playlistFileService';

describe('playlistFileService', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    mockUuid.reset();
    resetInMemoryTauriStore();
  });

  it('returns empty index when no playlists saved', async () => {
    expect(await new PlaylistIndexStore().load()).toEqual([]);
  });

  it('round-trips a playlist through save and load', async () => {
    const playlist = new PlaylistBuilder().withTrackCount(1).build();
    await new PlaylistFileStore().save(playlist);
    expect(await new PlaylistFileStore().load(playlist.id)).toEqual(playlist);
  });

  it('updates the index when saving a playlist', async () => {
    const playlist = new PlaylistBuilder().withTrackCount(2).build();
    await new PlaylistFileStore().save(playlist);
    await new PlaylistIndexStore().upsert(playlist);
    const index = await new PlaylistIndexStore().load();
    expect(index).toMatchInlineSnapshot(`
      [
        {
          "artwork": undefined,
          "createdAtIso": "2026-01-01T00:00:00.000Z",
          "id": "mock-uuid-0",
          "isReadOnly": false,
          "itemCount": 2,
          "lastModifiedIso": "2026-01-01T00:00:00.000Z",
          "name": "Test Playlist",
          "totalDurationMs": 360000,
        },
      ]
    `);
  });

  it('removes playlist and updates index on delete', async () => {
    const playlist = new PlaylistBuilder().build();
    await new PlaylistFileStore().save(playlist);
    await new PlaylistIndexStore().upsert(playlist);
    await new PlaylistFileStore().delete(playlist.id);
    await new PlaylistIndexStore().remove(playlist.id);

    expect(await new PlaylistIndexStore().load()).toHaveLength(0);
    expect(await new PlaylistFileStore().load(playlist.id)).toBeNull();
  });

  it('returns null for nonexistent playlist', async () => {
    expect(await new PlaylistFileStore().load('nonexistent')).toBeNull();
  });
});
