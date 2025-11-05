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

export type Stream = {
  url: string;
  protocol: 'file' | 'http' | 'https' | 'hls';
  mimeType?: string;
  bitrateKbps?: number;
  codec?: string;
  container?: string;
  qualityLabel?: string;
  durationMs?: number;
  contentLengthBytes?: number;
  source: ProviderRef;
};

export type LocalFileInfo = {
  fileUri: string;
  fileSize?: number;
  format?: string;
  bitrateKbps?: number;
  sampleRateHz?: number;
  channels?: number;
  fingerprint?: string;
  scannedAtIso?: string;
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
  streams?: Stream[];
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
  lastModifiedIso?: string;
  items: PlaylistItem[];
};

export type PlaylistItem = {
  id: string;
  title: string;
  artists: ArtistCredit[];
  album?: string;
  durationMs?: number;
  artwork?: ArtworkSet;
  note?: string;
  addedAtIso?: string;
  source: ProviderRef;
};

export { pickArtwork } from './artwork';
export type { QueueItem, RepeatMode, Queue } from './queue';
export type { SearchCategory, SearchParams, SearchResults } from './search';
