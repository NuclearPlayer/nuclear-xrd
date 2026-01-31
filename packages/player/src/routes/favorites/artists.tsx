import { createFileRoute } from '@tanstack/react-router';

import { FavoriteArtists } from '../../views/Favorites';

export const Route = createFileRoute('/favorites/artists')({
  component: FavoriteArtists,
});
