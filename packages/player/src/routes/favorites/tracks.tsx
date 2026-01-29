import { createFileRoute } from '@tanstack/react-router';

import { FavoriteTracks } from '../../views/Favorites';

export const Route = createFileRoute('/favorites/tracks')({
  component: FavoriteTracks,
});
