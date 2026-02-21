import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { PLAYLIST_EXPORT_VERSION } from '@nuclearplayer/model';

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

      const exportData = { version: PLAYLIST_EXPORT_VERSION, ...playlist };
      await writeTextFile(filePath, JSON.stringify(exportData, null, 2));
      toast.success('Playlist exported');
    } catch (error) {
      await reportError('playlists', {
        userMessage: 'Failed to export playlist',
        error,
      });
    }
  }, [playlist]);

  return { exportAsJson };
};
