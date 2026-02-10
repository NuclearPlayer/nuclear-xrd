import { FC } from 'react';

import type { Track } from '@nuclearplayer/model';
import {
  TrackTable,
  TrackTableActions,
  TrackTableProps,
} from '@nuclearplayer/ui';

import { useQueueActions } from '../hooks/useQueueActions';
import { useFavoritesStore } from '../stores/favoritesStore';
import { ConnectedTrackContextMenu } from './ConnectedTrackContextMenu';

type ConnectedTrackTableProps = Omit<
  TrackTableProps<Track>,
  'actions' | 'meta'
> & {
  actions?: Pick<TrackTableActions<Track>, 'onRemove' | 'onReorder'>;
};

export const ConnectedTrackTable: FC<ConnectedTrackTableProps> = (props) => {
  const { actions: externalActions, ...restProps } = props;
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
      {...restProps}
      display={{
        displayFavorite: true,
        ...restProps.display,
      }}
      actions={{
        onAddToQueue: (track) => queueActions.addToQueue([track]),
        onPlayNow: (track) => queueActions.playNow(track),
        onPlayNext: (track) => queueActions.addNext([track]),
        onToggleFavorite: handleToggleFavorite,
        onRemove: externalActions?.onRemove,
        onReorder: externalActions?.onReorder,
      }}
      meta={{
        isTrackFavorite: (track) => isTrackFavorite(track.source),
        ContextMenuWrapper: ConnectedTrackContextMenu,
      }}
    />
  );
};
