import { useParams } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';

import { usePlaylistStore } from '../../stores/playlistStore';

export const usePlaylistDetail = () => {
  const { playlistId } = useParams({ from: '/playlists/$playlistId' });
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);
  const playlist = usePlaylistStore((state) => state.playlists.get(playlistId));

  useEffect(() => {
    loadPlaylist(playlistId);
  }, [playlistId, loadPlaylist]);

  const items = playlist?.items ?? [];
  const tracks = useMemo(() => items.map((item) => item.track), [items]);

  return { playlistId, playlist, items, tracks };
};
