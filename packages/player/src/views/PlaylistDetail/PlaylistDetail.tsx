import { useParams } from '@tanstack/react-router';
import isEmpty from 'lodash-es/isEmpty';
import { useEffect, useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Badge, ViewShell } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { usePlaylistStore } from '../../stores/playlistStore';

export const PlaylistDetail: FC = () => {
  const { t } = useTranslation('playlists');
  const { playlistId } = useParams({ from: '/playlists/$playlistId' });
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);
  const playlist = usePlaylistStore((state) => state.playlists.get(playlistId));

  useEffect(() => {
    loadPlaylist(playlistId);
  }, [playlistId, loadPlaylist]);

  const tracks = useMemo(
    () => playlist?.items.map((item) => item.track) ?? [],
    [playlist],
  );

  return (
    <ViewShell data-testid="playlist-detail-view" title={playlist?.name ?? ''}>
      <span data-testid="playlist-detail-title">{playlist?.name}</span>
      {playlist && (
        <div className="mb-4 flex items-center gap-3">
          <span
            data-testid="playlist-detail-track-count"
            className="text-foreground-secondary text-sm"
          >
            {t('trackCount', { count: playlist.items.length })}
          </span>
          {playlist.isReadOnly && playlist.origin && (
            <Badge variant="pill" color="cyan" data-testid="read-only-badge">
              {t('readOnlyBadge')}
            </Badge>
          )}
        </div>
      )}
      {!isEmpty(tracks) && (
        <ConnectedTrackTable
          tracks={tracks}
          features={{ header: true }}
          display={{
            displayThumbnail: true,
            displayArtist: true,
            displayDuration: tracks.some((t) => t.durationMs != null),
            displayQueueControls: true,
          }}
        />
      )}
    </ViewShell>
  );
};
