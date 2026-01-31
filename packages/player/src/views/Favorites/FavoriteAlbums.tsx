import { useNavigate } from '@tanstack/react-router';
import { Disc3 } from 'lucide-react';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Card, CardGrid, EmptyState, ViewShell } from '@nuclearplayer/ui';

import { useFavoritesStore } from '../../stores/favoritesStore';
import { sortByAddedAtDesc } from '../../utils/sort';

export const FavoriteAlbums: FC = () => {
  const { t } = useTranslation('favorites');
  const navigate = useNavigate();
  const albums = useFavoritesStore((state) => state.albums);

  const sortedAlbums = useMemo(() => sortByAddedAtDesc(albums), [albums]);

  return (
    <ViewShell data-testid="favorite-albums-view" title={t('albums.title')}>
      {sortedAlbums.length === 0 ? (
        <EmptyState
          icon={<Disc3 size={48} />}
          title={t('albums.empty')}
          description={t('albums.emptyDescription')}
          className="flex-1"
        />
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
