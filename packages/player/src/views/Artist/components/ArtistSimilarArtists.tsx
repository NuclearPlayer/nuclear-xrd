import { FC } from 'react';

import { pickArtwork } from '@nuclearplayer/model';
import { Loader } from '@nuclearplayer/ui';

import { useArtistRelatedArtists } from '../hooks/useArtistRelatedArtists';

type ArtistSimilarArtistsProps = {
  providerId: string;
  artistId: string;
};

export const ArtistSimilarArtists: FC<ArtistSimilarArtistsProps> = ({
  providerId,
  artistId,
}) => {
  const {
    data: artists,
    isLoading,
    isError,
  } = useArtistRelatedArtists(providerId, artistId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader data-testid="similar-artists-loader" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-accent-red p-4">Failed to load similar artists.</div>
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="mb-2 text-lg font-semibold">Similar artists</h2>
      <ul className="divide-border bg-primary border-border divide-y-2 border border-2">
        {(artists ?? []).slice(0, 5).map((a) => {
          const thumb = pickArtwork(a.artwork, 'thumbnail', 64);
          const avatar = thumb ?? pickArtwork(a.artwork, 'avatar', 64);
          return (
            <li
              key={a.source.id}
              className="flex cursor-default items-center gap-3 select-none"
            >
              {avatar ? (
                <img
                  src={avatar.url}
                  alt={a.name}
                  className="h-10 w-10 object-cover"
                />
              ) : (
                <div className="h-10 w-10" />
              )}
              <span className="truncate">{a.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
