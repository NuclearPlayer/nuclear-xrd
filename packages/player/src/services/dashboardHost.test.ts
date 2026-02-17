import { afterEach, describe, expect, it, vi } from 'vitest';

import { DashboardProviderBuilder } from '../test/builders/DashboardProviderBuilder';
import { reportError } from '../utils/logging';
import { createDashboardHost } from './dashboardHost';
import { providersHost } from './providersHost';

vi.mock('../utils/logging', () => ({
  reportError: vi.fn(),
}));

describe('dashboardHost', () => {
  afterEach(() => {
    providersHost.clear();
  });

  it('returns attributed results from a single provider with matching capability', async () => {
    const mockTracks = [
      { title: 'Track 1', artists: [], source: { id: '1', provider: 'test' } },
      { title: 'Track 2', artists: [], source: { id: '2', provider: 'test' } },
    ];

    const provider = new DashboardProviderBuilder()
      .withId('acme')
      .withName('Acme Music')
      .withMetadataProviderId('acme-metadata')
      .withCapabilities('topTracks')
      .withFetchTopTracks(vi.fn().mockResolvedValue(mockTracks))
      .build();

    providersHost.register(provider);

    const host = createDashboardHost();
    const results = await host.fetchTopTracks();

    expect(results).toEqual([
      {
        providerId: 'acme',
        metadataProviderId: 'acme-metadata',
        providerName: 'Acme Music',
        items: mockTracks,
      },
    ]);
  });

  it('returns attributed results from multiple providers with the same capability', async () => {
    const acmeArtists = [
      { name: 'Artist A', source: { id: 'a1', provider: 'acme' } },
    ];
    const soundwaveArtists = [
      { name: 'Artist B', source: { id: 'b1', provider: 'soundwave' } },
    ];

    const acmeProvider = new DashboardProviderBuilder()
      .withId('acme')
      .withName('Acme Music')
      .withMetadataProviderId('acme-metadata')
      .withCapabilities('topArtists')
      .withFetchTopArtists(vi.fn().mockResolvedValue(acmeArtists))
      .build();

    const soundwaveProvider = new DashboardProviderBuilder()
      .withId('soundwave')
      .withName('Soundwave')
      .withMetadataProviderId('soundwave-metadata')
      .withCapabilities('topArtists')
      .withFetchTopArtists(vi.fn().mockResolvedValue(soundwaveArtists))
      .build();

    providersHost.register(acmeProvider);
    providersHost.register(soundwaveProvider);

    const host = createDashboardHost();
    const results = await host.fetchTopArtists();

    expect(results).toHaveLength(2);
    expect(results).toEqual(
      expect.arrayContaining([
        {
          providerId: 'acme',
          metadataProviderId: 'acme-metadata',
          providerName: 'Acme Music',
          items: acmeArtists,
        },
        {
          providerId: 'soundwave',
          metadataProviderId: 'soundwave-metadata',
          providerName: 'Soundwave',
          items: soundwaveArtists,
        },
      ]),
    );
  });

  it('returns results only from the targeted provider when providerId is specified', async () => {
    const acmeAlbums = [
      { title: 'Album A', source: { id: 'al1', provider: 'acme' } },
    ];
    const soundwaveAlbums = [
      { title: 'Album B', source: { id: 'al2', provider: 'soundwave' } },
    ];

    const acmeProvider = new DashboardProviderBuilder()
      .withId('acme')
      .withName('Acme Music')
      .withMetadataProviderId('acme-metadata')
      .withCapabilities('topAlbums')
      .withFetchTopAlbums(vi.fn().mockResolvedValue(acmeAlbums))
      .build();

    const soundwaveProvider = new DashboardProviderBuilder()
      .withId('soundwave')
      .withName('Soundwave')
      .withMetadataProviderId('soundwave-metadata')
      .withCapabilities('topAlbums')
      .withFetchTopAlbums(vi.fn().mockResolvedValue(soundwaveAlbums))
      .build();

    providersHost.register(acmeProvider);
    providersHost.register(soundwaveProvider);

    const host = createDashboardHost();
    const results = await host.fetchTopAlbums('acme');

    expect(results).toEqual([
      {
        providerId: 'acme',
        metadataProviderId: 'acme-metadata',
        providerName: 'Acme Music',
        items: acmeAlbums,
      },
    ]);
  });

  it('skips providers that lack the requested capability', async () => {
    const provider = new DashboardProviderBuilder()
      .withId('limited-provider')
      .withName('Limited')
      .withMetadataProviderId('limited-metadata')
      .withCapabilities('topTracks')
      .build();

    providersHost.register(provider);

    const host = createDashboardHost();
    const results = await host.fetchNewReleases();

    expect(results).toEqual([]);
  });

  it('reports an error and skips a provider that declares a capability but lacks the fetch method', async () => {
    const brokenProvider = new DashboardProviderBuilder()
      .withId('broken-provider')
      .withName('Broken')
      .withMetadataProviderId('broken-metadata')
      .withCapabilities('topTracks')
      .build();

    const workingTracks = [
      {
        title: 'Track 1',
        artists: [],
        source: { id: '1', provider: 'working' },
      },
    ];
    const workingProvider = new DashboardProviderBuilder()
      .withId('working-provider')
      .withName('Working')
      .withMetadataProviderId('working-metadata')
      .withCapabilities('topTracks')
      .withFetchTopTracks(vi.fn().mockResolvedValue(workingTracks))
      .build();

    providersHost.register(brokenProvider);
    providersHost.register(workingProvider);

    const host = createDashboardHost();
    const results = await host.fetchTopTracks();

    expect(reportError).toHaveBeenCalledWith('dashboard', {
      userMessage: 'A dashboard provider failed to load data',
      error: expect.objectContaining({
        message: expect.stringContaining(
          'Provider "Broken" declared capability "topTracks"',
        ),
      }),
    });
    expect(results).toEqual([
      {
        providerId: 'working-provider',
        metadataProviderId: 'working-metadata',
        providerName: 'Working',
        items: workingTracks,
      },
    ]);
  });

  it('returns empty array when targeted provider lacks the requested capability', async () => {
    const provider = new DashboardProviderBuilder()
      .withId('partial-provider')
      .withName('Partial')
      .withMetadataProviderId('partial-metadata')
      .withCapabilities('topTracks')
      .withFetchTopTracks(vi.fn().mockResolvedValue([]))
      .build();

    providersHost.register(provider);

    const host = createDashboardHost();
    const results = await host.fetchNewReleases('partial-provider');

    expect(results).toEqual([]);
  });

  it('skips a provider that fails and still returns results from other providers', async () => {
    const failingFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const workingTracks = [
      {
        title: 'Track 1',
        artists: [],
        source: { id: '1', provider: 'working' },
      },
    ];
    const workingFetch = vi.fn().mockResolvedValue(workingTracks);

    const failingProvider = new DashboardProviderBuilder()
      .withId('failing-provider')
      .withName('Failing')
      .withMetadataProviderId('failing-metadata')
      .withCapabilities('topTracks')
      .withFetchTopTracks(failingFetch)
      .build();

    const workingProvider = new DashboardProviderBuilder()
      .withId('working-provider')
      .withName('Working')
      .withMetadataProviderId('working-metadata')
      .withCapabilities('topTracks')
      .withFetchTopTracks(workingFetch)
      .build();

    providersHost.register(failingProvider);
    providersHost.register(workingProvider);

    const host = createDashboardHost();
    const results = await host.fetchTopTracks();

    expect(failingFetch).toHaveBeenCalled();
    expect(reportError).toHaveBeenCalledWith('dashboard', {
      userMessage: 'A dashboard provider failed to load data',
      error: expect.objectContaining({ message: 'Network error' }),
    });
    expect(results).toEqual([
      {
        providerId: 'working-provider',
        metadataProviderId: 'working-metadata',
        providerName: 'Working',
        items: workingTracks,
      },
    ]);
  });

  it('returns an empty array when no providers are registered', async () => {
    const host = createDashboardHost();
    const results = await host.fetchEditorialPlaylists();

    expect(results).toEqual([]);
  });

  it('throws when targeting a provider that does not exist', async () => {
    const host = createDashboardHost();

    await expect(host.fetchTopAlbums('nonexistent')).rejects.toThrow();
  });
});
