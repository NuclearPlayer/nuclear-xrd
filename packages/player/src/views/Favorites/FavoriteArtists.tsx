import { useNavigate } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Card, CardGrid, EmptyState, ViewShell } from '@nuclearplayer/ui';

import { useFavoritesStore } from '../../stores/favoritesStore';

export const FavoriteArtists: FC = () => {
  const { t } = useTranslation('favorites');
  const navigate = useNavigate();
  const artists = useFavoritesStore((state) => state.artists);

  const sortedArtists = useMemo(
    () => [...artists].sort((a, b) => b.addedAtIso.localeCompare(a.addedAtIso)),
    [artists],
  );

  return (
    <ViewShell data-testid="favorite-artists-view" title={t('artists.title')}>
      {sortedArtists.length === 0 ? (
        <EmptyState
          icon={<User size={48} />}
          title={t('artists.empty')}
          description={t('artists.emptyDescription')}
          className="flex-1"
        />
      ) : (
        <CardGrid>
          {sortedArtists.map((entry) => (
            <Card
              key={`${entry.ref.source.provider}-${entry.ref.source.id}`}
              title={entry.ref.name}
              src={pickArtwork(entry.ref.artwork, 'cover', 300)?.url}
              onClick={() =>
                navigate({
                  to: `/artist/${entry.ref.source.provider}/${entry.ref.source.id}`,
                })
              }
            />
          ))}
        </CardGrid>
      )}
    </ViewShell>
  );
};
