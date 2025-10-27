import isEmpty from 'lodash-es/isEmpty';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Loader } from '@nuclearplayer/ui';

import { useArtistDetails } from '../hooks/useArtistDetails';

type ArtistHeaderProps = {
  providerId: string;
  artistId: string;
};

export const ArtistHeader: FC<ArtistHeaderProps> = ({
  providerId,
  artistId,
}) => {
  const { t } = useTranslation('artist');
  const {
    data: artist,
    isLoading,
    isError,
  } = useArtistDetails(providerId, artistId);
  const cover = artist ? pickArtwork(artist.artwork, 'cover', 1200) : undefined;
  const avatar = artist
    ? pickArtwork(artist.artwork, 'avatar', 300)
    : undefined;

  return (
    <div className="relative">
      <div className="absolute h-100 w-full bg-gradient-to-b from-transparent to-black"></div>
      {isLoading && (
        <div className="flex h-100 w-full items-center justify-center">
          <Loader size="xl" data-testid="artist-header-loader" />
        </div>
      )}
      {isError && (
        <div className="flex h-100 w-full flex-col items-center justify-center gap-3 p-6">
          <div className="text-accent-red">
            {t('errors.failedToLoadDetails')}
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {cover && (
            <div
              style={{ backgroundImage: `url(${cover.url})` }}
              className="h-100 w-full bg-cover bg-center"
            ></div>
          )}
          {artist && (
            <div className="absolute bottom-0 left-0 flex flex-row items-center gap-8 p-8">
              {avatar && (
                <img
                  className="border-border bottom-0 h-30 w-30 rounded-full border-2 select-none"
                  src={avatar.url}
                  alt={`${artist.name} avatar`}
                />
              )}
              <h1 className="flex cursor-default flex-col gap-2 text-6xl text-white select-none">
                {artist.name}
                {!isEmpty(artist.tags) && (
                  <div className="flex flex-wrap gap-2">
                    {artist.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary rounded-md px-2 py-1 font-sans text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </h1>
              {artist.onTour ? (
                <div>{t('onTour')}</div>
              ) : (
                <div className="bg-primary py-1d absolute top-0 right-0 flex items-center justify-center rounded-md px-2 text-white">
                  {t('notOnTour')}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
