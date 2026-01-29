import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { createTrack } from '../../test/fixtures/favorites';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';

const renderAtRoute = async (route: string) => {
  const history = createMemoryHistory({ initialEntries: [route] });
  const router = createRouter({ routeTree, history });
  const component = render(<App routerProp={router} />);
  await screen.findByTestId('favorite-tracks-view');
  return component;
};

describe('FavoriteTracks view', () => {
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
    const { getByTestId } = await renderAtRoute('/favorites/tracks');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('(Snapshot) renders with tracks', async () => {
    useFavoritesStore.setState({
      tracks: [
        {
          ref: createTrack('musicbrainz', 'track-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createTrack('musicbrainz', 'track-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    const { getByTestId } = await renderAtRoute('/favorites/tracks');
    expect(getByTestId('player-workspace-main')).toMatchSnapshot();
  });

  it('shows empty state when no favorite tracks', async () => {
    await renderAtRoute('/favorites/tracks');

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No favorite tracks yet')).toBeInTheDocument();
  });

  it('renders track table when favorites exist', async () => {
    useFavoritesStore.setState({
      tracks: [
        {
          ref: createTrack('musicbrainz', 'track-1'),
          addedAtIso: '2026-01-15T10:00:00.000Z',
        },
        {
          ref: createTrack('musicbrainz', 'track-2'),
          addedAtIso: '2026-01-14T10:00:00.000Z',
        },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/tracks');

    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('sorts tracks by addedAtIso descending (most recent first)', async () => {
    const olderTrack = createTrack('musicbrainz', 'older');
    olderTrack.title = 'Older Track';
    const newerTrack = createTrack('musicbrainz', 'newer');
    newerTrack.title = 'Newer Track';

    useFavoritesStore.setState({
      tracks: [
        { ref: olderTrack, addedAtIso: '2026-01-10T10:00:00.000Z' },
        { ref: newerTrack, addedAtIso: '2026-01-15T10:00:00.000Z' },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/tracks');

    const rows = screen.getAllByTestId('track-row');
    expect(rows[0]).toHaveTextContent('Newer Track');
    expect(rows[1]).toHaveTextContent('Older Track');
  });

  it('shows duration column when tracks have duration', async () => {
    const trackWithDuration = createTrack('musicbrainz', 'track-1');
    trackWithDuration.durationMs = 180000;

    useFavoritesStore.setState({
      tracks: [
        { ref: trackWithDuration, addedAtIso: '2026-01-15T10:00:00.000Z' },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/tracks');

    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('hides duration column when no tracks have duration', async () => {
    const trackWithoutDuration = createTrack('musicbrainz', 'track-1');

    useFavoritesStore.setState({
      tracks: [
        { ref: trackWithoutDuration, addedAtIso: '2026-01-15T10:00:00.000Z' },
      ],
      loaded: true,
    });

    await renderAtRoute('/favorites/tracks');

    const table = screen.getByRole('table');
    expect(table).not.toHaveTextContent('Duration');
  });
});
