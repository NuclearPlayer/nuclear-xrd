import { useCallback } from 'react';

import type { Track } from '@nuclearplayer/model';

import { useFavoritesStore } from '../stores/favoritesStore';
import { useQueueActions } from './useQueueActions';

export const useTrackActions = () => {
  const queueActions = useQueueActions();
  const { isTrackFavorite, addTrack, removeTrack } = useFavoritesStore();

  const playNow = useCallback(
    (track: Track) => queueActions.playNow(track),
    [queueActions],
  );

  const addNext = useCallback(
    (track: Track) => queueActions.addNext([track]),
    [queueActions],
  );

  const addToQueue = useCallback(
    (track: Track) => queueActions.addToQueue([track]),
    [queueActions],
  );

  const toggleFavorite = useCallback(
    (track: Track) => {
      if (isTrackFavorite(track.source)) {
        removeTrack(track.source);
      } else {
        addTrack(track);
      }
    },
    [isTrackFavorite, addTrack, removeTrack],
  );

  const isFavorite = useCallback(
    (track: Track) => isTrackFavorite(track.source),
    [isTrackFavorite],
  );

  return {
    playNow,
    addNext,
    addToQueue,
    toggleFavorite,
    isFavorite,
  };
};
