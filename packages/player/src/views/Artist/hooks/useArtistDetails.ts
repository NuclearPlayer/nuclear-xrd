import { useQuery } from '@tanstack/react-query';

import type { Artist } from '@nuclearplayer/model';

import { metadataHost } from '../../../services/metadataHost';

export const useArtistDetails = (providerId: string, artistId: string) => {
  return useQuery<Artist>({
    queryKey: ['artist-details', providerId, artistId],
    queryFn: () => metadataHost.fetchArtistDetails(artistId, providerId),
    enabled: Boolean(providerId && artistId),
  });
};
