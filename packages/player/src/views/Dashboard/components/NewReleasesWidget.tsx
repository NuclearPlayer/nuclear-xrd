import { useNavigate } from '@tanstack/react-router';
import { FC, useCallback } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { AlbumRef, pickArtwork } from '@nuclearplayer/model';
import type { AttributedResult } from '@nuclearplayer/plugin-sdk';
import type { CardsRowItem } from '@nuclearplayer/ui';

import { useDashboardNewReleases } from '../hooks/useDashboardData';
import { DashboardCardsWidget } from './DashboardCardsWidget';

export const NewReleasesWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { data: results, isLoading } = useDashboardNewReleases();

  const mapRelease = useCallback(
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
      data-testid="dashboard-new-releases"
      results={results}
      isLoading={isLoading}
      title={t('new-releases')}
      labels={{
        filterPlaceholder: t('filter-releases'),
        nothingFound: t('nothing-found'),
      }}
      mapItem={mapRelease}
    />
  );
};
