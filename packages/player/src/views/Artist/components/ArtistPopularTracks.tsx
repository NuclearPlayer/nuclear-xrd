import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Loader, TrackTable } from '@nuclearplayer/ui';

import { useArtistTopTracks } from '../hooks/useArtistTopTracks';

type ArtistPopularTracksProps = {
  providerId: string;
  artistId: string;
};

export const ArtistPopularTracks: FC<ArtistPopularTracksProps> = ({
  providerId,
  artistId,
}) => {
  const { t } = useTranslation('artist');
  const {
    data: tracks,
    isLoading,
    isError,
  } = useArtistTopTracks(providerId, artistId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader data-testid="popular-tracks-loader" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-accent-red p-4">
        {t('errors.failedToLoadPopularTracks')}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="mb-2 text-lg font-semibold">{t('popularTracks')}</h2>
      <TrackTable
        tracks={tracks ?? []}
        features={{ filterable: false }}
        display={{ displayDuration: false }}
      />
    </div>
  );
};
