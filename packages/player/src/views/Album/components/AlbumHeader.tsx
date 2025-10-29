import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { Loader } from '@nuclearplayer/ui';

import { useAlbumDetails } from '../hooks/useAlbumDetails';

type AlbumHeaderProps = {
  providerId: string;
  albumId: string;
};

export const AlbumHeader: FC<AlbumHeaderProps> = ({ providerId, albumId }) => {
  const { t } = useTranslation('album');
  const {
    data: album,
    isLoading,
    isError,
  } = useAlbumDetails(providerId, albumId);

  if (isLoading) {
    return (
      <div className="flex h-100 w-full items-center justify-center">
        <Loader size="xl" data-testid="album-header-loader" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-100 w-full flex-col items-center justify-center gap-3 p-6">
        <div className="text-accent-red">{t('errors.failedToLoadDetails')}</div>
      </div>
    );
  }

  if (!album) {
    return null;
  }

  const cover = pickArtwork(album.artwork, 'cover', 600);
  const releaseYear = album.releaseDate
    ? new Date(album.releaseDate.dateIso).getFullYear()
    : undefined;
  const trackCount = album.tracks?.length ?? 0;

  return (
    <div className="bg-primary border-border flex flex-col gap-6 border-b-2 p-8 md:flex-row">
      {cover && (
        <img
          src={cover.url}
          alt={album.title}
          className="border-border h-60 w-60 border-2 object-cover select-none"
        />
      )}

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold">{album.title}</h1>
          <div className="text-text-secondary text-lg">
            by {album.artists.map((a) => a.name).join(', ')}
          </div>
        </div>

        <div className="text-text-secondary flex flex-wrap gap-2 text-sm">
          {album.genres && album.genres.length > 0 && (
            <div>
              <span className="text-text-primary font-semibold">
                {t('genre')}:
              </span>{' '}
              {album.genres.join(', ')}
            </div>
          )}
          {releaseYear && (
            <div>
              <span className="text-text-primary font-semibold">
                {t('year')}:
              </span>{' '}
              {releaseYear}
            </div>
          )}
          <div>
            <span className="text-text-primary font-semibold">
              {t('tracks')}:
            </span>{' '}
            {trackCount}
          </div>
        </div>
      </div>
    </div>
  );
};
