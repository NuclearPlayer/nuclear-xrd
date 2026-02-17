import isEmpty from 'lodash-es/isEmpty';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Loader } from '@nuclearplayer/ui';

import { useDashboardTopArtists } from '../hooks/useDashboardData';

export const TopArtistsWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  const { data: results, isLoading } = useDashboardTopArtists();

  const artists = results?.flatMap((result) => result.items) ?? [];

  return (
    <div data-testid="dashboard-top-artists" className="flex flex-col">
      <h2 className="mb-2 text-lg font-semibold">{t('top-artists')}</h2>
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader data-testid="dashboard-top-artists-loader" />
        </div>
      ) : (
        !isEmpty(artists) && (
          <ul className="divide-border bg-primary border-border divide-y-2 border border-2">
            {artists.map((artist) => {
              const thumb = pickArtwork(artist.artwork, 'thumbnail', 64);
              const avatar = thumb ?? pickArtwork(artist.artwork, 'avatar', 64);
              return (
                <li
                  key={artist.source.id}
                  className="flex cursor-default items-center gap-3 select-none"
                >
                  {avatar ? (
                    <img
                      src={avatar.url}
                      alt={artist.name}
                      className="h-10 w-10 object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10" />
                  )}
                  <span className="truncate">{artist.name}</span>
                </li>
              );
            })}
          </ul>
        )
      )}
    </div>
  );
};
