import { useQuery } from '@tanstack/react-query';

import type { PlaylistRef } from '@nuclearplayer/model';

import { metadataHost } from '../../../services/metadataHost';

export const useArtistPlaylists = (providerId: string, artistId: string) => {
  return useQuery<PlaylistRef[]>({
    queryKey: ['artist-playlists', providerId, artistId],
    queryFn: () => metadataHost.fetchArtistPlaylists(artistId, providerId),
    enabled: Boolean(providerId && artistId),
  });
};
