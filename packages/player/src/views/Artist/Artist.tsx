import { useParams } from '@tanstack/react-router';
import { FC } from 'react';

import { ScrollableArea } from '@nuclearplayer/ui';

import { ArtistAlbumsGrid } from './components/ArtistAlbumsGrid';
import { ArtistHeader } from './components/ArtistHeader';
import { useArtistAlbums } from './hooks/useArtistAlbums';
import { useArtistDetails } from './hooks/useArtistDetails';

type ArtistProps = Record<string, never>;

export const Artist: FC<ArtistProps> = () => {
  const { providerId, artistId } = useParams({
    from: '/artist/$providerId/$artistId',
  });
  const {
    data: artist,
    isLoading: isArtistLoading,
    isError: isArtistError,
    refetch: refetchArtist,
  } = useArtistDetails(providerId, artistId);

  const {
    data: albums,
    isLoading: isAlbumsLoading,
    isError: isAlbumsError,
    refetch: refetchAlbums,
  } = useArtistAlbums(providerId, artistId);

  const isOnTour = artist?.onTour ?? false;
  return (
    <ScrollableArea>
      <ArtistHeader
        artist={artist}
        isLoading={isArtistLoading}
        isError={isArtistError}
        onRetry={() => void refetchArtist()}
      />

      {/* <div className="flex flex-row gap-4">
        <div className="flex flex-col">
          <h2>Popular tracks</h2>
          <TrackTable tracks={artist.topTracks ?? []} />
        </div>
        <div className="flex flex-col">
          <h2>Similar artists</h2>
          {artist.relatedArtists?.map((relatedArtist) => (
            <div key={relatedArtist.source.id}>{relatedArtist.name}</div>
          ))}
        </div>
      </div> */}

      {isOnTour && <div>On Tour</div>}
      <ScrollableArea>
        <ArtistAlbumsGrid
          albums={albums}
          isLoading={isAlbumsLoading}
          isError={isAlbumsError}
          onRetry={() => void refetchAlbums()}
        />
      </ScrollableArea>
    </ScrollableArea>
  );
};
