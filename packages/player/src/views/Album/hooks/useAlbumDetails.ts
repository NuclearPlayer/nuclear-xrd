import { useQuery } from '@tanstack/react-query';

import type { Album } from '@nuclearplayer/model';
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';

import { providersHost } from '../../../services/providersHost';
import { executeAlbumDetailsSearch } from '../../../services/search/executeAlbumMetadataSearch';

export const useAlbumDetails = (providerId: string, albumId: string) => {
  const provider = providersHost.get(providerId);

  return useQuery<Album>({
    queryKey: ['album-details', provider?.id, albumId],
    queryFn: () =>
      executeAlbumDetailsSearch(provider as MetadataProvider, albumId),
    enabled: Boolean(provider && albumId),
  });
};
