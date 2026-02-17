import { useQuery } from '@tanstack/react-query';

import type { ArtistRef, Track } from '@nuclearplayer/model';
import type { AttributedResult } from '@nuclearplayer/plugin-sdk';

import { dashboardHost } from '../../../services/dashboardHost';

const FIVE_MINUTES = 5 * 60 * 1000;

export const useDashboardTopTracks = () => {
  return useQuery<AttributedResult<Track>[]>({
    queryKey: ['dashboard', 'topTracks'],
    queryFn: () => dashboardHost.fetchTopTracks(),
    staleTime: FIVE_MINUTES,
  });
};

export const useDashboardTopArtists = () => {
  return useQuery<AttributedResult<ArtistRef>[]>({
    queryKey: ['dashboard', 'topArtists'],
    queryFn: () => dashboardHost.fetchTopArtists(),
    staleTime: FIVE_MINUTES,
  });
};
