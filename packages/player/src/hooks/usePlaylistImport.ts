import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@nuclearplayer/i18n';
import { playlistExportSchema } from '@nuclearplayer/model';

import { usePlaylistStore } from '../stores/playlistStore';
import { reportError } from '../utils/logging';

export const usePlaylistImport = () => {
  const { t } = useTranslation('playlists');

  const importFromJson = useCallback(async () => {
    try {
      const filePath = await open({
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });

      if (!filePath) {
        return;
      }

      const content = await readTextFile(filePath as string);
      const parsed = JSON.parse(content);
      const { playlist } = playlistExportSchema.parse(parsed);
      await usePlaylistStore.getState().importPlaylist(playlist);
      toast.success(t('importSuccess'));
    } catch (error) {
      await reportError('playlists', {
        userMessage: t('importError'),
        error,
      });
    }
  }, [t]);

  return { importFromJson };
};
