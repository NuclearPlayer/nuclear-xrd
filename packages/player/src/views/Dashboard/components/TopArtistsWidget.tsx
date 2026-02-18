import { useNavigate } from '@tanstack/react-router';
import { FC, useCallback } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { ArtistRef, pickArtwork } from '@nuclearplayer/model';
import type { AttributedResult } from '@nuclearplayer/plugin-sdk';
import type { CardsRowItem } from '@nuclearplayer/ui';

import { useDashboardTopArtists } from '../hooks/useDashboardData';
import { DashboardCardsWidget } from './DashboardCardsWidget';

export const TopArtistsWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { data: results, isLoading } = useDashboardTopArtists();

  const mapArtist = useCallback(
    (artist: ArtistRef, result: AttributedResult<ArtistRef>): CardsRowItem => ({
      id: `${result.metadataProviderId}-${artist.source.id}`,
      title: artist.name,
      imageUrl: pickArtwork(artist.artwork, 'cover', 300)?.url,
      onClick: () =>
        navigate({
          to: `/artist/${result.metadataProviderId}/${artist.source.id}`,
        }),
    }),
    [navigate],
  );

  return (
    <DashboardCardsWidget
      data-testid="dashboard-top-artists"
      results={results}
      isLoading={isLoading}
      title={t('top-artists')}
      labels={{
        filterPlaceholder: t('filter-artists'),
        nothingFound: t('nothing-found'),
      }}
      mapItem={mapArtist}
    />
  );
};
