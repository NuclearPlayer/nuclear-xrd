import { useQuery } from '@tanstack/react-query';

import type { ArtistBio } from '@nuclearplayer/model';

import { metadataHost } from '../../../services/metadataHost';

export const useArtistBio = (providerId: string, artistId: string) => {
  return useQuery<ArtistBio>({
    queryKey: ['artist-bio', providerId, artistId],
    queryFn: () => metadataHost.fetchArtistBio(artistId, providerId),
    enabled: Boolean(providerId && artistId),
  });
};
