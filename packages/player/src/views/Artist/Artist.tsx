import { useParams } from '@tanstack/react-router';
import { FC } from 'react';

import { ScrollableArea } from '@nuclearplayer/ui';

import { ArtistAlbumsGrid } from './components/ArtistAlbumsGrid';
import { ArtistHeader } from './components/ArtistHeader';
import { ArtistPopularTracks } from './components/ArtistPopularTracks';
import { ArtistSimilarArtists } from './components/ArtistSimilarArtists';

type ArtistProps = Record<string, never>;

export const Artist: FC<ArtistProps> = () => {
  const { providerId, artistId } = useParams({
    from: '/artist/$providerId/$artistId',
  });
  return (
    <ScrollableArea>
      <ArtistHeader providerId={providerId} artistId={artistId} />

      <div className="flex flex-col gap-6 p-6 md:flex-row">
        <div className="md:w-2/3">
          <ArtistPopularTracks providerId={providerId} artistId={artistId} />
        </div>
        <div className="md:w-1/3">
          <ArtistSimilarArtists providerId={providerId} artistId={artistId} />
        </div>
      </div>

      <ScrollableArea>
        <ArtistAlbumsGrid
          providerId={providerId}
          artistId={artistId}
          data-testid="artist-albums-grid"
        />
      </ScrollableArea>
    </ScrollableArea>
  );
};
