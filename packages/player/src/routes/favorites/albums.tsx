import { createFileRoute } from '@tanstack/react-router';

import { FavoriteAlbums } from '../../views/Favorites';

export const Route = createFileRoute('/favorites/albums')({
  component: FavoriteAlbums,
});
