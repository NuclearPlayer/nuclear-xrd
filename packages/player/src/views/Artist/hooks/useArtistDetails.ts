import { useQuery } from '@tanstack/react-query';

import type { Artist } from '@nuclearplayer/model';
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';

import { providersHost } from '../../../services/providersHost';
import { executeArtistDetailsSearch } from '../../../services/search/executeArtistMetadataSearch';

export const useArtistDetails = (providerId: string, artistId: string) => {
  const provider = providersHost.get(providerId);

  return useQuery<Artist>({
    queryKey: ['artist-details', provider?.id, artistId],
    queryFn: () =>
      executeArtistDetailsSearch(provider as MetadataProvider, artistId),
    enabled: Boolean(provider && artistId),
  });
};
