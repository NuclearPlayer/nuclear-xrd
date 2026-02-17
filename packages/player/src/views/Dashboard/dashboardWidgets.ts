import { FC } from 'react';

import type { DashboardCapability } from '@nuclearplayer/plugin-sdk';

import { TopArtistsWidget } from './components/TopArtistsWidget';
import { TopTracksWidget } from './components/TopTracksWidget';

export type DashboardWidgetProps = object;

export type DashboardWidgetEntry = {
  capability: DashboardCapability;
  component: FC<DashboardWidgetProps>;
};

export const DASHBOARD_WIDGETS: DashboardWidgetEntry[] = [
  { capability: 'topTracks', component: TopTracksWidget },
  { capability: 'topArtists', component: TopArtistsWidget },
];
