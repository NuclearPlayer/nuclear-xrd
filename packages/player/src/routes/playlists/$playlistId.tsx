import { createFileRoute } from '@tanstack/react-router';

import { PlaylistDetailView } from '../../views/Playlists';

export const Route = createFileRoute('/playlists/$playlistId')({
  component: PlaylistDetailView,
});
