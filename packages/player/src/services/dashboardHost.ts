import type {
  AttributedResult,
  DashboardCapability,
  DashboardHost,
  DashboardProvider,
} from '@nuclearplayer/plugin-sdk';

import { providersHost } from './providersHost';

type FetchMethod = keyof {
  [K in keyof DashboardProvider as DashboardProvider[K] extends
    | (() => Promise<unknown>)
    | undefined
    ? K
    : never]: DashboardProvider[K];
};

const CAPABILITY_TO_METHOD: Record<DashboardCapability, FetchMethod> = {
  topTracks: 'fetchTopTracks',
  topArtists: 'fetchTopArtists',
  topAlbums: 'fetchTopAlbums',
  editorialPlaylists: 'fetchEditorialPlaylists',
  newReleases: 'fetchNewReleases',
};

const getDashboardProviders = (): DashboardProvider[] =>
  providersHost.list('dashboard') as DashboardProvider[];

const createAttributedFetcher =
  <T>(capability: DashboardCapability) =>
  async (providerId?: string): Promise<AttributedResult<T>[]> => {
    const method = CAPABILITY_TO_METHOD[capability];

    if (providerId) {
      const provider = providersHost.get<DashboardProvider>(providerId);
      if (!provider) {
        throw new Error(`Dashboard provider not found: ${providerId}`);
      }
      if (!provider.capabilities.includes(capability)) {
        return [];
      }
      const fetchFn = provider[method] as (() => Promise<T[]>) | undefined;
      if (!fetchFn) {
        return [];
      }
      const items = await fetchFn();
      return [
        {
          providerId: provider.id,
          metadataProviderId: provider.metadataProviderId,
          providerName: provider.name,
          items,
        },
      ];
    }

    const providers = getDashboardProviders().filter((provider) =>
      provider.capabilities.includes(capability),
    );

    const results = await Promise.allSettled(
      providers.map(async (provider) => {
        const fetchFn = provider[method] as (() => Promise<T[]>) | undefined;
        if (!fetchFn) {
          return null;
        }
        const items = await fetchFn();
        return {
          providerId: provider.id,
          metadataProviderId: provider.metadataProviderId,
          providerName: provider.name,
          items,
        } satisfies AttributedResult<T>;
      }),
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<AttributedResult<T>> =>
          result.status === 'fulfilled' && result.value !== null,
      )
      .map((result) => result.value);
  };

export const createDashboardHost = (): DashboardHost => ({
  fetchTopTracks: createAttributedFetcher('topTracks'),
  fetchTopArtists: createAttributedFetcher('topArtists'),
  fetchTopAlbums: createAttributedFetcher('topAlbums'),
  fetchEditorialPlaylists: createAttributedFetcher('editorialPlaylists'),
  fetchNewReleases: createAttributedFetcher('newReleases'),
});

export const dashboardHost: DashboardHost = createDashboardHost();
