import { useParams } from '@tanstack/react-router';
import { FC } from 'react';

import { ScrollableArea } from '@nuclearplayer/ui';

import { AlbumHeader } from './components/AlbumHeader';
import { AlbumTrackList } from './components/AlbumTrackList';

type AlbumProps = Record<string, never>;

export const Album: FC<AlbumProps> = () => {
  const { providerId, albumId } = useParams({
    from: '/album/$providerId/$albumId',
  });

  return (
    <ScrollableArea className="bg-background">
      <AlbumHeader providerId={providerId} albumId={albumId} />
      <div className="p-6">
        <AlbumTrackList providerId={providerId} albumId={albumId} />
      </div>
    </ScrollableArea>
  );
};
