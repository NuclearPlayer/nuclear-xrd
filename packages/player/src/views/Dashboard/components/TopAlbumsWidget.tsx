import { useNavigate } from '@tanstack/react-router';
import { FC, useCallback } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { AlbumRef, pickArtwork } from '@nuclearplayer/model';
import type { AttributedResult } from '@nuclearplayer/plugin-sdk';
import type { CardsRowItem } from '@nuclearplayer/ui';

import { useDashboardTopAlbums } from '../hooks/useDashboardData';
import { DashboardCardsWidget } from './DashboardCardsWidget';

export const TopAlbumsWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { data: results, isLoading } = useDashboardTopAlbums();

  const mapAlbum = useCallback(
    (album: AlbumRef, result: AttributedResult<AlbumRef>): CardsRowItem => ({
      id: `${result.metadataProviderId}-${album.source.id}`,
      title: album.title,
      subtitle: album.artists?.map((artist) => artist.name).join(', '),
      imageUrl: pickArtwork(album.artwork, 'cover', 300)?.url,
      onClick: () =>
        navigate({
          to: `/album/${result.metadataProviderId}/${album.source.id}`,
        }),
    }),
    [navigate],
  );

  return (
    <DashboardCardsWidget
      data-testid="dashboard-top-albums"
      results={results}
      isLoading={isLoading}
      title={t('top-albums')}
      labels={{
        filterPlaceholder: t('filter-albums'),
        nothingFound: t('nothing-found'),
      }}
      mapItem={mapAlbum}
    />
  );
};
