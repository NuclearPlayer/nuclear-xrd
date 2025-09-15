import { useParams } from '@tanstack/react-router';
import { FC } from 'react';

import { ScrollableArea } from '@nuclearplayer/ui';

import { ArtistAlbumsGrid } from './components/ArtistAlbumsGrid';
import { ArtistHeader } from './components/ArtistHeader';

type ArtistProps = Record<string, never>;

export const Artist: FC<ArtistProps> = () => {
  const { providerId, artistId } = useParams({
    from: '/artist/$providerId/$artistId',
  });
  return (
    <ScrollableArea>
      <ArtistHeader providerId={providerId} artistId={artistId} />

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

      <ScrollableArea>
        <ArtistAlbumsGrid providerId={providerId} artistId={artistId} />
      </ScrollableArea>
    </ScrollableArea>
  );
};
