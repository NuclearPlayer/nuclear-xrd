import { FC, useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Track, TrackRef } from '@nuclearplayer/model';
import { Loader, TrackTable } from '@nuclearplayer/ui';

import { useAlbumDetails } from '../hooks/useAlbumDetails';

const mapTrackRefs = (refs: TrackRef[]): Track[] => {
  return refs.map((ref) => ({
    ...ref,
    artists: ref.artists.map((a) => ({ name: a.name, roles: [] })),
  }));
};

type AlbumTrackListProps = {
  providerId: string;
  albumId: string;
};

export const AlbumTrackList: FC<AlbumTrackListProps> = ({
  providerId,
  albumId,
}) => {
  const { t } = useTranslation('album');
  const {
    data: album,
    isLoading,
    isError,
  } = useAlbumDetails(providerId, albumId);

  const tracks = useMemo(
    () => (album?.tracks ? mapTrackRefs(album.tracks) : []),
    [album?.tracks],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader data-testid="album-tracks-loader" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-accent-red p-4">
        {t('errors.failedToLoadTracks')}
      </div>
    );
  }

  if (!album) {
    return null;
  }

  const albumHasDuration = tracks.some(
    (track) => track.durationMs != undefined,
  );

  return (
    <TrackTable
      tracks={tracks}
      features={{ filterable: false }}
      display={{ displayDuration: albumHasDuration, displayThumbnail: false }}
    />
  );
};
