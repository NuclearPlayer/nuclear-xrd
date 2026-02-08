import { useParams } from '@tanstack/react-router';
import { useEffect, type FC } from 'react';

import { ViewShell } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../stores/playlistStore';

export const PlaylistDetail: FC = () => {
  const { playlistId } = useParams({ from: '/playlists/$playlistId' });
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);
  const playlist = usePlaylistStore((state) => state.playlists.get(playlistId));

  useEffect(() => {
    loadPlaylist(playlistId);
  }, [playlistId, loadPlaylist]);

  return (
    <ViewShell data-testid="playlist-detail-view" title={playlist?.name ?? ''}>
      <span data-testid="playlist-detail-title">{playlist?.name}</span>
    </ViewShell>
  );
};
