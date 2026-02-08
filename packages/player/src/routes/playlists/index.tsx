import { createFileRoute } from '@tanstack/react-router';

import { PlaylistsView } from '../../views/Playlists';

export const Route = createFileRoute('/playlists/')({
  component: PlaylistsView,
});
