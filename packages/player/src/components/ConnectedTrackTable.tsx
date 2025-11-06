import { FC } from 'react';

import type { Track } from '@nuclearplayer/model';
import { TrackTable, TrackTableProps } from '@nuclearplayer/ui';

import { useQueueActions } from '../hooks/useQueueActions';

export const ConnectedTrackTable: FC<
  Omit<TrackTableProps<Track>, 'actions'>
> = (props) => {
  const queueActions = useQueueActions();

  return (
    <TrackTable
      {...props}
      actions={{
        onAddToQueue: (track) => queueActions.addToQueue([track]),
      }}
    />
  );
};
