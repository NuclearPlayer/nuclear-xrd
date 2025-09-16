import { FC } from 'react';

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
  const {
    data: tracks,
    isLoading,
    isError,
  } = useArtistTopTracks(providerId, artistId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-accent-red p-4">Failed to load popular tracks.</div>
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="mb-2 text-lg font-semibold">Popular tracks</h2>
      <TrackTable tracks={tracks ?? []} />
    </div>
  );
};
