import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersHost } from '../../services/providersHost';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { createArtistRef } from '../../test/fixtures/favorites';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';

const renderAtRoute = async (route: string) => {
  const history = createMemoryHistory({ initialEntries: [route] });
  const router = createRouter({ routeTree, history });
  const component = render(<App routerProp={router} />);
  await screen.findByTestId('favorite-artists-view');
  return component;
};

describe('FavoriteArtists view', () => {
  beforeEach(() => {
    providersHost.clear();
    resetInMemoryTauriStore();
    useFavoritesStore.setState({
      tracks: [],
      albums: [],
      artists: [],
      loaded: true,
    });
  });

  it('(Snapshot) renders empty state', async () => {
    const { getByTestId } = await renderAtRoute('/favorites/artists');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('(Snapshot) renders with artists', async () => {
    useFavoritesStore.setState({
      artists: [
        {
          ref: createArtistRef('musicbrainz', 'artist-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createArtistRef('musicbrainz', 'artist-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    const { getByTestId } = await renderAtRoute('/favorites/artists');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('shows empty state when no favorite artists', async () => {
    await renderAtRoute('/favorites/artists');

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No favorite artists yet')).toBeInTheDocument();
  });

  it('renders artist cards when favorites exist', async () => {
    useFavoritesStore.setState({
      artists: [
        {
          ref: createArtistRef('musicbrainz', 'artist-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createArtistRef('musicbrainz', 'artist-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/artists');

    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
  });

  it('sorts artists by addedAtIso descending (most recent first)', async () => {
    const olderArtist = createArtistRef('musicbrainz', 'older');
    olderArtist.name = 'Older Artist';
    const newerArtist = createArtistRef('musicbrainz', 'newer');
    newerArtist.name = 'Newer Artist';

    useFavoritesStore.setState({
      artists: [
        { ref: olderArtist, addedAtIso: '2026-01-10T10:00:00.000Z' },
        { ref: newerArtist, addedAtIso: '2026-01-15T10:00:00.000Z' },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/artists');

    const cards = screen.getAllByTestId('card');
    expect(cards[0]).toHaveTextContent('Newer Artist');
    expect(cards[1]).toHaveTextContent('Older Artist');
  });

  it('navigates to artist detail page when card is clicked', async () => {
    const user = userEvent.setup();
    const artist = createArtistRef('test-provider', 'test-artist-id');
    artist.name = 'Test Artist';

    const provider = new MetadataProviderBuilder()
      .withId('test-provider')
      .withArtistMetadataCapabilities(['artistBio'])
      .withFetchArtistBio(async () => ({
        name: 'Test Artist',
        artwork: { items: [] },
        source: { provider: 'test-provider', id: 'test-artist-id' },
      }))
      .build();
    providersHost.register(provider);

    useFavoritesStore.setState({
      artists: [{ ref: artist, addedAtIso: '2026-01-15T10:00:00.000Z' }],
      loaded: true,
    });

    await renderAtRoute('/favorites/artists');

    const card = screen.getByTestId('card');
    await user.click(card);

    await screen.findByRole('heading', { name: 'Test Artist' });
  });
});
