import { FC } from 'react';

import type { Artist as ArtistModel } from '@nuclearplayer/model';
import { pickArtwork } from '@nuclearplayer/model';
import { Button, Loader } from '@nuclearplayer/ui';

type ArtistHeaderProps = {
  artist?: ArtistModel;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export const ArtistHeader: FC<ArtistHeaderProps> = ({
  artist,
  isLoading,
  isError,
  onRetry,
}) => {
  const cover = artist ? pickArtwork(artist.artwork, 'cover', 1200) : undefined;
  const avatar = artist
    ? pickArtwork(artist.artwork, 'avatar', 300)
    : undefined;

  return (
    <div className="relative">
      <div className="absolute h-100 w-full bg-gradient-to-b from-transparent to-black"></div>
      {isLoading ? (
        <div className="flex h-100 w-full items-center justify-center">
          <Loader size="xl" />
        </div>
      ) : isError ? (
        <div className="flex h-100 w-full flex-col items-center justify-center gap-3 p-6">
          <div className="text-accent-red">Failed to load artist details.</div>
          <Button onClick={onRetry}>Retry</Button>
        </div>
      ) : (
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
              <h1 className="cursor-default text-6xl text-white select-none">
                {artist.name}
              </h1>
              <div>{artist.tags}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
