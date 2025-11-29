import { useQuery } from '@tanstack/react-query';

import type { Album } from '@nuclearplayer/model';

import { metadataHost } from '../../../services/metadataHost';

export const useAlbumDetails = (providerId: string, albumId: string) => {
  return useQuery<Album>({
    queryKey: ['album-details', providerId, albumId],
    queryFn: () => metadataHost.fetchAlbumDetails(albumId, providerId),
    enabled: Boolean(providerId && albumId),
  });
};
