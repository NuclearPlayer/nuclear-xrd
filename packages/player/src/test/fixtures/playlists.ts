export const playlistFileServiceMock = {
  playlistFileService: {
    loadIndex: vi.fn().mockResolvedValue([]),
    loadPlaylist: vi.fn().mockResolvedValue(null),
    savePlaylist: vi
      .fn()
      .mockImplementation(
        async (playlist: {
          id: string;
          name: string;
          createdAtIso: string;
          lastModifiedIso: string;
          isReadOnly: boolean;
          items: { track: { durationMs?: number } }[];
        }) => [
          {
            id: playlist.id,
            name: playlist.name,
            createdAtIso: playlist.createdAtIso,
            lastModifiedIso: playlist.lastModifiedIso,
            isReadOnly: playlist.isReadOnly,
            itemCount: playlist.items.length,
            totalDurationMs: playlist.items.reduce(
              (sum, item) => sum + (item.track.durationMs ?? 0),
              0,
            ),
          },
        ],
      ),
    deletePlaylist: vi.fn().mockResolvedValue([]),
    rebuildIndex: vi.fn().mockResolvedValue([]),
  },
};
