import type { LocalFileInfo, StreamCandidate } from './streaming';

export type ProviderRef = {
  provider: string;
  id: string;
  url?: string;
};

export type ArtistCredit = {
  name: string;
  roles: string[];
  source?: ProviderRef;
};

export type ArtworkPurpose = 'avatar' | 'cover' | 'background' | 'thumbnail';

export type Artwork = {
  url: string;
  width?: number;
  height?: number;
  purpose?: ArtworkPurpose;
  source?: ProviderRef;
};

export type ArtworkSet = {
  items: Artwork[];
};

export type ArtistRef = {
  name: string;
  disambiguation?: string;
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type AlbumRef = {
  title: string;
  artists?: ArtistRef[];
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type TrackRef = {
  title: string;
  artists: ArtistRef[];
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type PlaylistRef = {
  id: string;
  name: string;
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type Track = {
  title: string;
  artists: ArtistCredit[];
  album?: AlbumRef;
  durationMs?: number;
  trackNumber?: number;
  disc?: string;
  artwork?: ArtworkSet;
  tags?: string[];
  source: ProviderRef;
  localFile?: LocalFileInfo;
  streamCandidates?: StreamCandidate[];
};

export type Album = {
  title: string;
  artists: ArtistCredit[];
  tracks?: TrackRef[];
  releaseDate?: {
    precision: 'year' | 'month' | 'day';
    dateIso: string;
  };
  genres?: string[];
  artwork?: ArtworkSet;
  source: ProviderRef;
};

export type Artist = {
  name: string;
  disambiguation?: string;
  bio?: string;
  onTour?: boolean;
  artwork?: ArtworkSet;
  tags?: string[];
  source: ProviderRef;
};

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  artwork?: ArtworkSet;
  tags?: string[];
  createdAtIso: string;
  lastModifiedIso: string;
  origin?: ProviderRef;
  isReadOnly: boolean;
  parentId?: string;
  items: PlaylistItem[];
};

export type PlaylistIndexEntry = Omit<Playlist, 'items'> & {
  itemCount: number;
  totalDurationMs: number;
};

export type PlaylistItem<T extends Track = Track> = {
  id: string;
  track: T;
  note?: string;
  addedAtIso: string;
};

export { pickArtwork } from './artwork';
export type { QueueItem, RepeatMode, Queue } from './queue';
export type { SearchCategory, SearchParams, SearchResults } from './search';
export type { LocalFileInfo, Stream, StreamCandidate } from './streaming';
