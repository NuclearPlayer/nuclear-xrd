import { useQuery } from '@tanstack/react-query';

import type { ArtistRef } from '@nuclearplayer/model';

import { metadataHost } from '../../../services/metadataHost';

export const useArtistRelatedArtists = (
  providerId: string,
  artistId: string,
) => {
  return useQuery<ArtistRef[]>({
    queryKey: ['artist-related-artists', providerId, artistId],
    queryFn: () => metadataHost.fetchArtistRelatedArtists(artistId, providerId),
    enabled: Boolean(providerId && artistId),
  });
};
