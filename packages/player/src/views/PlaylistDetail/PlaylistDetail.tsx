import isEmpty from 'lodash-es/isEmpty';
import type { FC } from 'react';

import { ViewShell } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { PlaylistDetailActions } from './components/PlaylistDetailActions';
import { PlaylistDetailHeader } from './components/PlaylistDetailHeader';
import { usePlaylistDetail } from './usePlaylistDetail';

export const PlaylistDetail: FC = () => {
  const { playlistId, playlist, tracks } = usePlaylistDetail();

  return (
    <ViewShell data-testid="playlist-detail-view" title={playlist?.name ?? ''}>
      {playlist && <PlaylistDetailHeader playlist={playlist} />}
      {playlist && <PlaylistDetailActions playlistId={playlistId} />}
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
