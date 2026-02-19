import { FC } from 'react';

import type { DashboardCapability } from '@nuclearplayer/plugin-sdk';

import { EditorialPlaylistsWidget } from './components/EditorialPlaylistsWidget';
import { NewReleasesWidget } from './components/NewReleasesWidget';
import { TopAlbumsWidget } from './components/TopAlbumsWidget';
import { TopArtistsWidget } from './components/TopArtistsWidget';
import { TopTracksWidget } from './components/TopTracksWidget';

export type DashboardWidgetProps = object;

export type DashboardWidgetEntry = {
  capability: DashboardCapability;
  component: FC<DashboardWidgetProps>;
};

export const DASHBOARD_WIDGETS: DashboardWidgetEntry[] = [
  { capability: 'editorialPlaylists', component: EditorialPlaylistsWidget },
  { capability: 'topArtists', component: TopArtistsWidget },
  { capability: 'topAlbums', component: TopAlbumsWidget },
  { capability: 'newReleases', component: NewReleasesWidget },
  { capability: 'topTracks', component: TopTracksWidget },
];
