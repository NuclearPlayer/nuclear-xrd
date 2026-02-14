import { FC } from 'react';

import type { ArtistMetadataCapability } from '@nuclearplayer/plugin-sdk';

import { ArtistAlbumsGrid } from './components/ArtistAlbumsGrid';
import { ArtistBioHeader } from './components/ArtistBioHeader';
import { ArtistPlaylistsGrid } from './components/ArtistPlaylistsGrid';
import { ArtistPopularTracks } from './components/ArtistPopularTracks';
import { ArtistSimilarArtists } from './components/ArtistSimilarArtists';
import { ArtistSocialHeader } from './components/ArtistSocialHeader';

export type ArtistWidgetProps = {
  providerId: string;
  artistId: string;
};

export type ArtistWidgetEntry = {
  capability: ArtistMetadataCapability;
  component: FC<ArtistWidgetProps>;
  group?: string;
  width?: string;
};

export const ARTIST_WIDGETS: ArtistWidgetEntry[] = [
  { capability: 'artistBio', component: ArtistBioHeader },
  { capability: 'artistSocialStats', component: ArtistSocialHeader },
  {
    capability: 'artistTopTracks',
    component: ArtistPopularTracks,
    group: 'tracks-and-related',
    width: 'md:w-2/3',
  },
  {
    capability: 'artistRelatedArtists',
    component: ArtistSimilarArtists,
    group: 'tracks-and-related',
    width: 'md:w-1/3',
  },
  { capability: 'artistAlbums', component: ArtistAlbumsGrid },
  { capability: 'artistPlaylists', component: ArtistPlaylistsGrid },
];

export type WidgetGroup = {
  key: string;
  entries: ArtistWidgetEntry[];
};

export const groupWidgets = (widgets: ArtistWidgetEntry[]): WidgetGroup[] => {
  const groups: WidgetGroup[] = [];

  for (const widget of widgets) {
    const lastGroup = groups[groups.length - 1];
    if (
      widget.group &&
      lastGroup &&
      lastGroup.entries[0]?.group === widget.group
    ) {
      lastGroup.entries.push(widget);
    } else {
      groups.push({
        key: widget.group ?? widget.capability,
        entries: [widget],
      });
    }
  }

  return groups;
};
