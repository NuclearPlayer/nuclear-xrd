import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { useCallback } from 'react';

import { usePlaylistStore } from '../stores/playlistStore';
import { reportError } from '../utils/logging';

export const usePlaylistExport = (playlistId: string) => {
  const playlist = usePlaylistStore((state) => state.playlists.get(playlistId));

  const exportAsJson = useCallback(async () => {
    try {
      const filePath = await save({
        defaultPath: `${playlist?.name ?? 'playlist'}.json`,
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
      });

      if (!filePath) {
        return;
      }

      const { items, ...rest } = playlist!;
      const exportData = { ...rest, tracks: items };
      await writeTextFile(filePath, JSON.stringify(exportData, null, 2));
    } catch (error) {
      await reportError('playlists', {
        userMessage: 'Failed to export playlist',
        error,
      });
    }
  }, [playlist]);

  return { exportAsJson };
};
