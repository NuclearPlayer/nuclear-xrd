import { DashboardProviderBuilder } from '../../test/builders/DashboardProviderBuilder';
import { TOP_TRACKS_RADIOHEAD } from '../../test/fixtures/dashboard';
import { DashboardWrapper } from './Dashboard.test-wrapper';

describe('Dashboard view', () => {
  beforeEach(() => {
    DashboardWrapper.reset();
  });

  it('shows empty state when no providers are registered', async () => {
    await DashboardWrapper.mount();

    expect(DashboardWrapper.emptyState).toBeInTheDocument();
    expect(DashboardWrapper.topTracks.table).not.toBeInTheDocument();
  });

  it('renders tracks in a table when a provider supplies top tracks', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.topTracksProvider(),
    );

    await DashboardWrapper.mount();

    expect(DashboardWrapper.emptyState).not.toBeInTheDocument();
    expect(DashboardWrapper.topTracks.heading).toBeInTheDocument();
    expect(
      await DashboardWrapper.topTracks.findTrack(
        'Everything In Its Right Place',
      ),
    ).toBeInTheDocument();
    expect(
      await DashboardWrapper.topTracks.findTrack('Idioteque'),
    ).toBeInTheDocument();
  });

  it('renders both tracks and artists when provider has both capabilities', async () => {
    DashboardWrapper.seedProvider(
      DashboardWrapper.fixtures.topTracksAndArtistsProvider(),
    );

    await DashboardWrapper.mount();

    expect(DashboardWrapper.topTracks.heading).toBeInTheDocument();
    expect(
      await DashboardWrapper.topTracks.findTrack(
        'Everything In Its Right Place',
      ),
    ).toBeInTheDocument();

    expect(DashboardWrapper.topArtists.heading).toBeInTheDocument();
    expect(
      await DashboardWrapper.topArtists.findArtist('Radiohead'),
    ).toBeInTheDocument();
    expect(
      await DashboardWrapper.topArtists.findArtist('Björk'),
    ).toBeInTheDocument();
  });

  it('shows tracks from multiple providers', async () => {
    DashboardWrapper.seedProvider(
      new DashboardProviderBuilder()
        .withId('provider-a')
        .withName('Soundwave')
        .withCapabilities('topTracks')
        .withFetchTopTracks(async () => [TOP_TRACKS_RADIOHEAD[0]]),
    );
    DashboardWrapper.seedProvider(
      new DashboardProviderBuilder()
        .withId('provider-b')
        .withName('Wavelength')
        .withCapabilities('topTracks')
        .withFetchTopTracks(async () => [TOP_TRACKS_RADIOHEAD[1]]),
    );

    await DashboardWrapper.mount();

    expect(
      await DashboardWrapper.topTracks.findTrack(
        'Everything In Its Right Place',
      ),
    ).toBeInTheDocument();
    expect(
      await DashboardWrapper.topTracks.findTrack('Idioteque'),
    ).toBeInTheDocument();
  });
});
