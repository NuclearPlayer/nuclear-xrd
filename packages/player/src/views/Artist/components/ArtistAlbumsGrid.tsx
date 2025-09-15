import { FC } from 'react';

import type { AlbumRef } from '@nuclearplayer/model';
import { pickArtwork } from '@nuclearplayer/model';
import { Button, Card, CardGrid, Loader } from '@nuclearplayer/ui';

type ArtistAlbumsGridProps = {
  albums?: AlbumRef[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export const ArtistAlbumsGrid: FC<ArtistAlbumsGridProps> = ({
  albums,
  isLoading,
  isError,
  onRetry,
}) => {
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
        <Button onClick={onRetry}>Retry</Button>
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
