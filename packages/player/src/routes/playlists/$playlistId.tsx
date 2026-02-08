import { createFileRoute } from '@tanstack/react-router';

import { PlaylistDetailView } from '../../views/PlaylistDetail';

export const Route = createFileRoute('/playlists/$playlistId')({
  component: PlaylistDetailView,
});
