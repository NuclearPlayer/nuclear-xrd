import type {
  DashboardCapability,
  DashboardProvider,
} from '@nuclearplayer/plugin-sdk';

export class DashboardProviderBuilder {
  private provider: DashboardProvider;

  constructor() {
    this.provider = {
      id: 'test-dashboard',
      kind: 'dashboard',
      name: 'Test Dashboard',
      metadataProviderId: 'test-metadata',
      capabilities: [],
    };
  }

  withId(id: DashboardProvider['id']): this {
    this.provider.id = id;
    return this;
  }

  withName(name: DashboardProvider['name']): this {
    this.provider.name = name;
    return this;
  }

  withMetadataProviderId(id: DashboardProvider['metadataProviderId']): this {
    this.provider.metadataProviderId = id;
    return this;
  }

  withCapabilities(...capabilities: DashboardCapability[]): this {
    this.provider.capabilities = capabilities;
    return this;
  }

  withFetchTopTracks(
    fetchTopTracks: DashboardProvider['fetchTopTracks'],
  ): this {
    this.provider.fetchTopTracks = fetchTopTracks;
    return this;
  }

  withFetchTopArtists(
    fetchTopArtists: DashboardProvider['fetchTopArtists'],
  ): this {
    this.provider.fetchTopArtists = fetchTopArtists;
    return this;
  }

  withFetchTopAlbums(
    fetchTopAlbums: DashboardProvider['fetchTopAlbums'],
  ): this {
    this.provider.fetchTopAlbums = fetchTopAlbums;
    return this;
  }

  withFetchEditorialPlaylists(
    fetchEditorialPlaylists: DashboardProvider['fetchEditorialPlaylists'],
  ): this {
    this.provider.fetchEditorialPlaylists = fetchEditorialPlaylists;
    return this;
  }

  withFetchNewReleases(
    fetchNewReleases: DashboardProvider['fetchNewReleases'],
  ): this {
    this.provider.fetchNewReleases = fetchNewReleases;
    return this;
  }

  build(): DashboardProvider {
    return this.provider;
  }
}
