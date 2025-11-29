import { useQuery } from '@tanstack/react-query';

import type { AlbumRef } from '@nuclearplayer/model';

import { metadataHost } from '../../../services/metadataHost';

export const useArtistAlbums = (providerId: string, artistId: string) => {
  return useQuery<AlbumRef[]>({
    queryKey: ['artist-albums', providerId, artistId],
    queryFn: () => metadataHost.fetchArtistAlbums(artistId, providerId),
    enabled: Boolean(providerId && artistId),
  });
};
