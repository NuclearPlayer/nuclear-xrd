import { useQuery } from '@tanstack/react-query';

import type { ArtistSocialStats } from '@nuclearplayer/model';

import { metadataHost } from '../../../services/metadataHost';

export const useArtistSocialStats = (providerId: string, artistId: string) => {
  return useQuery<ArtistSocialStats>({
    queryKey: ['artist-social-stats', providerId, artistId],
    queryFn: () => metadataHost.fetchArtistSocialStats(artistId, providerId),
    enabled: Boolean(providerId && artistId),
  });
};
