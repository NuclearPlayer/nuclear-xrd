import { useParams } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';

import type { PlaylistItem } from '@nuclearplayer/model';

import { usePlaylistStore } from '../../stores/playlistStore';

const EMPTY_ITEMS: PlaylistItem[] = [];

export const usePlaylistDetail = () => {
  const { playlistId } = useParams({ from: '/playlists/$playlistId' });
  const loadPlaylist = usePlaylistStore((state) => state.loadPlaylist);
  const playlist = usePlaylistStore((state) => state.playlists.get(playlistId));

  useEffect(() => {
    loadPlaylist(playlistId);
  }, [playlistId, loadPlaylist]);

  const items = playlist?.items ?? EMPTY_ITEMS;
  const tracks = useMemo(() => items.map((item) => item.track), [items]);

  return { playlistId, playlist, items, tracks };
};
