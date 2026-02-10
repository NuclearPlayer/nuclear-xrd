import { useCallback } from 'react';

import type { PlaylistItem, Track } from '@nuclearplayer/model';

import { usePlaylistStore } from '../../stores/playlistStore';

export const usePlaylistEditing = (
  playlistId: string,
  items: PlaylistItem[],
  isEditable: boolean,
) => {
  const removeTracks = usePlaylistStore((state) => state.removeTracks);
  const reorderTracks = usePlaylistStore((state) => state.reorderTracks);

  const handleRemove = useCallback(
    (track: Track) => {
      const item = items.find((i) => i.track.source.id === track.source.id);
      removeTracks(playlistId, [item!.id]);
    },
    [items, playlistId, removeTracks],
  );

  const handleReorder = useCallback(
    (from: number, to: number) => {
      reorderTracks(playlistId, from, to);
    },
    [playlistId, reorderTracks],
  );

  const getItemId = useCallback(
    (_track: Track, index: number) => items[index]?.id ?? String(index),
    [items],
  );

  return isEditable
    ? {
        isEditable: true as const,
        actions: { onRemove: handleRemove, onReorder: handleReorder },
        getItemId,
      }
    : {
        isEditable: false as const,
        actions: undefined,
        getItemId: undefined,
      };
};
