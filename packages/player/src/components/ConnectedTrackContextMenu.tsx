import { Heart, ListEnd, ListStart, Play } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork, Track } from '@nuclearplayer/model';
import { TrackContextMenu } from '@nuclearplayer/ui';

import { useTrackActions } from '../hooks/useTrackActions';

type ConnectedTrackContextMenuProps = {
  track: Track;
  children: ReactNode;
};

export const ConnectedTrackContextMenu: FC<ConnectedTrackContextMenuProps> = ({
  track,
  children,
}) => {
  const { t } = useTranslation('track');
  const trackActions = useTrackActions();

  const isFavorite = trackActions.isFavorite(track);
  const thumbnail = pickArtwork(track.artwork, 'thumbnail', 64)?.url;
  const artistNames = track.artists.map((a) => a.name).join(', ');

  return (
    <TrackContextMenu>
      <TrackContextMenu.Trigger>{children}</TrackContextMenu.Trigger>
      <TrackContextMenu.Content>
        <TrackContextMenu.Header
          title={track.title}
          subtitle={artistNames}
          coverUrl={thumbnail}
        />
        <TrackContextMenu.Action
          icon={<Play size={16} />}
          onClick={() => trackActions.playNow(track)}
        >
          {t('actions.playNow')}
        </TrackContextMenu.Action>
        <TrackContextMenu.Action
          icon={<ListStart size={16} />}
          onClick={() => trackActions.addNext(track)}
        >
          {t('actions.playNext')}
        </TrackContextMenu.Action>
        <TrackContextMenu.Action
          icon={<ListEnd size={16} />}
          onClick={() => trackActions.addToQueue(track)}
        >
          {t('actions.addToQueue')}
        </TrackContextMenu.Action>
        <TrackContextMenu.Action
          icon={<Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />}
          onClick={() => trackActions.toggleFavorite(track)}
        >
          {isFavorite
            ? t('actions.removeFromFavorites')
            : t('actions.addToFavorites')}
        </TrackContextMenu.Action>
      </TrackContextMenu.Content>
    </TrackContextMenu>
  );
};
