import { useNavigate } from '@tanstack/react-router';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Card, CardGrid, ViewShell } from '@nuclearplayer/ui';

import { useFavoritesStore } from '../../stores/favoritesStore';

export const FavoriteArtists: FC = () => {
  const { t } = useTranslation('navigation');
  const navigate = useNavigate();
  const artists = useFavoritesStore((state) => state.artists);

  const sortedArtists = useMemo(
    () => [...artists].sort((a, b) => b.addedAtIso.localeCompare(a.addedAtIso)),
    [artists],
  );

  return (
    <ViewShell data-testid="favorite-artists-view" title={t('favoriteArtists')}>
      {sortedArtists.length === 0 ? (
        <div className="text-muted-foreground flex flex-1 items-center justify-center">
          {t('noFavoriteArtists')}
        </div>
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
