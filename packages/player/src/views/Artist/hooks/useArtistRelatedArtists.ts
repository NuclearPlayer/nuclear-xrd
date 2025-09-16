import { useQuery } from '@tanstack/react-query';

import type { ArtistRef } from '@nuclearplayer/model';
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';

import { providersServiceHost } from '../../../services/providersService';
import { executeArtistRelatedArtistsSearch } from '../../../services/search/executeArtistMetadataSearch';

export const useArtistRelatedArtists = (
  providerId: string,
  artistId: string,
) => {
  const provider = providersServiceHost.get(providerId);

  return useQuery<ArtistRef[]>({
    queryKey: ['artist-related-artists', provider?.id, artistId],
    queryFn: () =>
      executeArtistRelatedArtistsSearch(provider as MetadataProvider, artistId),
    enabled: Boolean(provider && artistId),
  });
};
