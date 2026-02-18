import { useQuery } from '@tanstack/react-query';

import type {
  AlbumRef,
  ArtistRef,
  PlaylistRef,
  Track,
} from '@nuclearplayer/model';
import type {
  AttributedResult,
  DashboardCapability,
} from '@nuclearplayer/plugin-sdk';

import { dashboardHost } from '../../../services/dashboardHost';

const FIVE_MINUTES = 5 * 60 * 1000;

const createDashboardDataFetchHook = <T>(
  capability: DashboardCapability,
  fetchFn: () => Promise<AttributedResult<T>[]>,
) => {
  return () =>
    useQuery<AttributedResult<T>[]>({
      queryKey: ['dashboard', capability],
      queryFn: fetchFn,
      staleTime: FIVE_MINUTES,
    });
};

export const useDashboardTopTracks = createDashboardDataFetchHook<Track>(
  'topTracks',
  () => dashboardHost.fetchTopTracks(),
);

export const useDashboardTopArtists = createDashboardDataFetchHook<ArtistRef>(
  'topArtists',
  () => dashboardHost.fetchTopArtists(),
);

export const useDashboardTopAlbums = createDashboardDataFetchHook<AlbumRef>(
  'topAlbums',
  () => dashboardHost.fetchTopAlbums(),
);

export const useDashboardEditorialPlaylists =
  createDashboardDataFetchHook<PlaylistRef>('editorialPlaylists', () =>
    dashboardHost.fetchEditorialPlaylists(),
  );

export const useDashboardNewReleases = createDashboardDataFetchHook<AlbumRef>(
  'newReleases',
  () => dashboardHost.fetchNewReleases(),
);
