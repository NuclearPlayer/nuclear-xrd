import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { createAlbumRef } from '../../test/fixtures/favorites';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';

const renderAtRoute = async (route: string) => {
  const history = createMemoryHistory({ initialEntries: [route] });
  const router = createRouter({ routeTree, history });
  const component = render(<App routerProp={router} />);
  await screen.findByTestId('favorite-albums-view');
  return component;
};

describe('FavoriteAlbums view', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    useFavoritesStore.setState({
      tracks: [],
      albums: [],
      artists: [],
      loaded: true,
    });
  });

  it('(Snapshot) renders empty state', async () => {
    const { getByTestId } = await renderAtRoute('/favorites/albums');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('(Snapshot) renders with albums', async () => {
    useFavoritesStore.setState({
      albums: [
        {
          ref: createAlbumRef('musicbrainz', 'album-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createAlbumRef('musicbrainz', 'album-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    const { getByTestId } = await renderAtRoute('/favorites/albums');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('shows empty state when no favorite albums', async () => {
    await renderAtRoute('/favorites/albums');

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No favorite albums yet')).toBeInTheDocument();
  });

  it('renders album cards when favorites exist', async () => {
    useFavoritesStore.setState({
      albums: [
        {
          ref: createAlbumRef('musicbrainz', 'album-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createAlbumRef('musicbrainz', 'album-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/albums');

    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
  });

  it('sorts albums by addedAtIso descending (most recent first)', async () => {
    const olderAlbum = createAlbumRef('musicbrainz', 'older');
    olderAlbum.title = 'Older Album';
    const newerAlbum = createAlbumRef('musicbrainz', 'newer');
    newerAlbum.title = 'Newer Album';

    useFavoritesStore.setState({
      albums: [
        { ref: olderAlbum, addedAtIso: '2026-01-10T10:00:00.000Z' },
        { ref: newerAlbum, addedAtIso: '2026-01-15T10:00:00.000Z' },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/albums');

    const cards = screen.getAllByTestId('card');
    expect(cards[0]).toHaveTextContent('Newer Album');
    expect(cards[1]).toHaveTextContent('Older Album');
  });

  it('navigates to album detail page when card is clicked', async () => {
    const user = userEvent.setup();
    const album = createAlbumRef('test-provider', 'test-album-id');
    album.title = 'Test Album';

    useFavoritesStore.setState({
      albums: [{ ref: album, addedAtIso: '2026-01-15T10:00:00.000Z' }],
      loaded: true,
    });

    await renderAtRoute('/favorites/albums');

    const card = screen.getByTestId('card');
    await user.click(card);

    await screen.findByTestId('album-view');
  });
});
