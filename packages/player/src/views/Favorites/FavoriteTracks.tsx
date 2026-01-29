import { Music } from 'lucide-react';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState, ViewShell } from '@nuclearplayer/ui';

import { ConnectedTrackTable } from '../../components/ConnectedTrackTable';
import { useFavoritesStore } from '../../stores/favoritesStore';

export const FavoriteTracks: FC = () => {
  const { t } = useTranslation('navigation');
  const favorites = useFavoritesStore((state) => state.tracks);

  const sortedTracks = useMemo(
    () =>
      [...favorites]
        .sort((a, b) => b.addedAtIso.localeCompare(a.addedAtIso))
        .map((entry) => entry.ref),
    [favorites],
  );

  const hasDuration = sortedTracks.some((track) => track.durationMs != null);

  return (
    <ViewShell data-testid="favorite-tracks-view" title={t('favoriteTracks')}>
      {sortedTracks.length === 0 ? (
        <EmptyState
          icon={<Music size={48} />}
          title={t('noFavoriteTracks')}
          description={t('noFavoriteTracksDescription')}
          className="flex-1"
        />
      ) : (
        <ConnectedTrackTable
          tracks={sortedTracks}
          features={{
            header: true,
            filterable: true,
            sortable: true,
          }}
          display={{
            displayThumbnail: true,
            displayArtist: true,
            displayDuration: hasDuration,
            displayQueueControls: true,
          }}
        />
      )}
    </ViewShell>
  );
};
