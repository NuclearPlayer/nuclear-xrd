import type { AlbumRef, ArtistRef, PlaylistRef, Track } from './index';

export type SearchCategory = 'artists' | 'albums' | 'tracks' | 'playlists';

export type SearchParams = {
  query: string;
  types?: SearchCategory[];
  limit?: number;
};

export type SearchResults = {
  artists?: ArtistRef[];
  albums?: AlbumRef[];
  tracks?: Track[];
  playlists?: PlaylistRef[];
};
