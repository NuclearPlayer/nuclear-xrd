import { FC } from 'react';

import { pickArtwork } from '@nuclearplayer/model';
import { Card, CardGrid, Loader } from '@nuclearplayer/ui';

import { useArtistAlbums } from '../hooks/useArtistAlbums';

type ArtistAlbumsGridProps = {
  providerId: string;
  artistId: string;
};

export const ArtistAlbumsGrid: FC<ArtistAlbumsGridProps> = ({
  providerId,
  artistId,
}) => {
  const {
    data: albums,
    isLoading,
    isError,
  } = useArtistAlbums(providerId, artistId);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 p-8">
        <div className="text-accent-red">Failed to load albums.</div>
      </div>
    );
  }

  return (
    <CardGrid>
      {albums?.map((album) => (
        <Card
          key={album.source.id}
          title={album.title}
          subtitle={album.artists?.map((a) => a.name).join(', ')}
          src={pickArtwork(album.artwork, 'cover', 300)?.url}
        />
      ))}
    </CardGrid>
  );
};
