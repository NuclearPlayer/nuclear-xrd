import { useMemo, useState } from 'react';

import type { PlaylistIndexEntry } from '@nuclearplayer/model';

import { usePlaylistStore } from '../stores/playlistStore';

const FILTER_THRESHOLD = 5;
const MAX_VISIBLE_ITEMS = 5;

export const usePlaylistSubmenu = () => {
  const playlistIndex = usePlaylistStore((state) => state.index);
  const addTracks = usePlaylistStore((state) => state.addTracks);
  const [filterText, setFilterText] = useState('');

  const showFilter = playlistIndex.length >= FILTER_THRESHOLD;

  const filteredPlaylists: PlaylistIndexEntry[] = useMemo(() => {
    const filtered = filterText
      ? playlistIndex.filter((entry) =>
          entry.name.toLowerCase().includes(filterText.toLowerCase()),
        )
      : playlistIndex;
    return filtered.slice(0, MAX_VISIBLE_ITEMS);
  }, [playlistIndex, filterText]);

  return {
    playlists: filteredPlaylists,
    hasPlaylists: playlistIndex.length > 0,
    showFilter,
    filterText,
    setFilterText,
    addTracks,
  };
};
