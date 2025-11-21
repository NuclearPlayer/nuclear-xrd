import { useQuery } from '@tanstack/react-query';

import type { Track, TrackRef } from '@nuclearplayer/model';
import type { MetadataProvider } from '@nuclearplayer/plugin-sdk';

import { providersHost } from '../../../services/providersHost';
import { executeArtistTopTracksSearch } from '../../../services/search/executeArtistMetadataSearch';

const mapTrackRefs = (refs: TrackRef[]): Track[] => {
  return refs.map((ref) => ({
    ...ref,
    artists: ref.artists.map((a) => ({ name: a.name, roles: [] })),
  }));
};

export const useArtistTopTracks = (providerId: string, artistId: string) => {
  const provider = providersHost.get(providerId);

  return useQuery<Track[]>({
    queryKey: ['artist-top-tracks', provider?.id, artistId],
    queryFn: async () => {
      const refs = await executeArtistTopTracksSearch(
        provider as MetadataProvider,
        artistId,
      );
      return mapTrackRefs(refs);
    },
    enabled: Boolean(provider && artistId),
  });
};
