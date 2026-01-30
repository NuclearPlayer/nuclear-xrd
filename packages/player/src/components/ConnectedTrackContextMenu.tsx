import { Heart, ListEnd, ListStart, Play } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork, Track } from '@nuclearplayer/model';
import { TrackContextMenu } from '@nuclearplayer/ui';

import { useQueueActions } from '../hooks/useQueueActions';
import { useFavoritesStore } from '../stores/favoritesStore';

type ConnectedTrackContextMenuProps = {
  track: Track;
  children: ReactNode;
  className?: string;
};

export const ConnectedTrackContextMenu: FC<ConnectedTrackContextMenuProps> = ({
  track,
  children,
  className,
}) => {
  const { t } = useTranslation();
  const { playNow, addNext, addToQueue } = useQueueActions();
  const { isTrackFavorite, addTrack, removeTrack } = useFavoritesStore();

  const isFavorite = isTrackFavorite(track.source);
  const thumbnail = pickArtwork(track.artwork, 'thumbnail', 64)?.url;
  const artistNames = track.artists.map((a) => a.name).join(', ');

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeTrack(track.source);
    } else {
      addTrack(track);
    }
  };

  return (
    <TrackContextMenu className={className}>
      <TrackContextMenu.Trigger>{children}</TrackContextMenu.Trigger>
      <TrackContextMenu.Content>
        <TrackContextMenu.Header
          title={track.title}
          subtitle={artistNames}
          coverUrl={thumbnail}
        />
        <div className="py-1">
          <TrackContextMenu.Action
            icon={<Play size={16} />}
            onClick={() => playNow(track)}
          >
            {t('track.actions.playNow')}
          </TrackContextMenu.Action>
          <TrackContextMenu.Action
            icon={<ListStart size={16} />}
            onClick={() => addNext([track])}
          >
            {t('track.actions.playNext')}
          </TrackContextMenu.Action>
          <TrackContextMenu.Action
            icon={<ListEnd size={16} />}
            onClick={() => addToQueue([track])}
          >
            {t('track.actions.addToQueue')}
          </TrackContextMenu.Action>
          <TrackContextMenu.Action
            icon={
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            }
            onClick={handleToggleFavorite}
          >
            {isFavorite
              ? t('track.actions.removeFromFavorites')
              : t('track.actions.addToFavorites')}
          </TrackContextMenu.Action>
        </div>
      </TrackContextMenu.Content>
    </TrackContextMenu>
  );
};
