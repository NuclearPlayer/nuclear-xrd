import { useNavigate } from '@tanstack/react-router';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Card, CardGrid, ViewShell } from '@nuclearplayer/ui';

import { useFavoritesStore } from '../../stores/favoritesStore';

export const FavoriteAlbums: FC = () => {
  const { t } = useTranslation('navigation');
  const navigate = useNavigate();
  const albums = useFavoritesStore((state) => state.albums);

  const sortedAlbums = useMemo(
    () => [...albums].sort((a, b) => b.addedAtIso.localeCompare(a.addedAtIso)),
    [albums],
  );

  return (
    <ViewShell data-testid="favorite-albums-view" title={t('favoriteAlbums')}>
      {sortedAlbums.length === 0 ? (
        <div className="text-muted-foreground flex flex-1 items-center justify-center">
          {t('noFavoriteAlbums')}
        </div>
      ) : (
        <CardGrid>
          {sortedAlbums.map((entry) => (
            <Card
              key={`${entry.ref.source.provider}-${entry.ref.source.id}`}
              title={entry.ref.title}
              src={pickArtwork(entry.ref.artwork, 'cover', 300)?.url}
              onClick={() =>
                navigate({
                  to: `/album/${entry.ref.source.provider}/${entry.ref.source.id}`,
                })
              }
            />
          ))}
        </CardGrid>
      )}
    </ViewShell>
  );
};
