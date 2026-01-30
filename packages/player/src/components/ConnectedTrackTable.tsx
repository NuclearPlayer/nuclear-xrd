import { FC } from 'react';

import type { Track } from '@nuclearplayer/model';
import { TrackTable, TrackTableProps } from '@nuclearplayer/ui';

import { useQueueActions } from '../hooks/useQueueActions';
import { useFavoritesStore } from '../stores/favoritesStore';

export const ConnectedTrackTable: FC<
  Omit<TrackTableProps<Track>, 'actions' | 'meta'>
> = (props) => {
  const queueActions = useQueueActions();
  const { isTrackFavorite, addTrack, removeTrack } = useFavoritesStore();

  const handleToggleFavorite = (track: Track) => {
    if (isTrackFavorite(track.source)) {
      removeTrack(track.source);
    } else {
      addTrack(track);
    }
  };

  return (
    <TrackTable
      {...props}
      display={{
        displayFavorite: true,
        ...props.display,
      }}
      actions={{
        onAddToQueue: (track) => queueActions.addToQueue([track]),
        onPlayNow: (track) => queueActions.playNow(track),
        onPlayNext: (track) => queueActions.addNext([track]),
        onToggleFavorite: handleToggleFavorite,
      }}
      meta={{
        isTrackFavorite: (track) => isTrackFavorite(track.source),
      }}
    />
  );
};
