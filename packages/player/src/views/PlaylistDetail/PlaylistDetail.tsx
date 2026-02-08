import { useParams } from '@tanstack/react-router';
import { useEffect, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ViewShell } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../stores/playlistStore';

export const PlaylistDetail: FC = () => {
  const { t } = useTranslation('playlists');
  const { playlistId } = useParams({ from: '/playlists/$playlistId' });
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);
  const playlist = usePlaylistStore((state) => state.playlists.get(playlistId));

  useEffect(() => {
    loadPlaylist(playlistId);
  }, [playlistId, loadPlaylist]);

  return (
    <ViewShell data-testid="playlist-detail-view" title={playlist?.name ?? ''}>
      <span data-testid="playlist-detail-title">{playlist?.name}</span>
      {playlist && (
        <span
          data-testid="playlist-detail-track-count"
          className="text-foreground-secondary text-sm"
        >
          {t('trackCount', { count: playlist.items.length })}
        </span>
      )}
    </ViewShell>
  );
};
