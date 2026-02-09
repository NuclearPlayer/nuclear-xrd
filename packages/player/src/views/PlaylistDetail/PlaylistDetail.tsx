import isEmpty from 'lodash-es/isEmpty';
import { ListMusicIcon } from 'lucide-react';
import type { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState, ViewShell } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { PlaylistDetailActions } from './components/PlaylistDetailActions';
import { PlaylistDetailHeader } from './components/PlaylistDetailHeader';
import { usePlaylistDetail } from './usePlaylistDetail';

export const PlaylistDetail: FC = () => {
  const { t } = useTranslation('playlists');
  const { playlistId, playlist, tracks } = usePlaylistDetail();

  return (
    <ViewShell data-testid="playlist-detail-view" title={playlist?.name ?? ''}>
      {playlist && <PlaylistDetailHeader playlist={playlist} />}
      {playlist && (
        <PlaylistDetailActions playlistId={playlistId} tracks={tracks} />
      )}
      {isEmpty(tracks) ? (
        <EmptyState
          icon={<ListMusicIcon size={48} />}
          title={t('emptyTracks')}
          description={t('emptyTracksDescription')}
          className="flex-1"
        />
      ) : (
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
