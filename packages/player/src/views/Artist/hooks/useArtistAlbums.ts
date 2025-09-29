import { useQuery } from '@tanstack/react-query';

import type { AlbumRef } from '@nuclearplayer/model';
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';

import { providersServiceHost } from '../../../services/providersService';
import { executeArtistAlbumsSearch } from '../../../services/search/executeArtistMetadataSearch';

export const useArtistAlbums = (providerId: string, artistId: string) => {
  const provider = providersServiceHost.get(providerId);

  return useQuery<AlbumRef[]>({
    queryKey: ['artist-albums', provider?.id, artistId],
    queryFn: () =>
      executeArtistAlbumsSearch(provider as MetadataProvider, artistId),
    enabled: Boolean(provider && artistId),
  });
};
