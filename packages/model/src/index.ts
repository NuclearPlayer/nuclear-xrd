export type ProviderRef = {
  provider: string;
  id: string;
  url?: string;
};

export type Credit = {
  name: string;
  roles?: string[];
  kind?: 'person' | 'group';
  joinPhrase?: string;
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

export type Stream = {
  url: string;
  mimeType?: string;
  bitrateKbps?: number;
  codec?: string;
  container?: string;
  qualityLabel?: string;
  durationMs?: number;
  contentLength?: number;
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
  artists: Credit[];
  album?: {
    title: string;
    artists?: Credit[];
  };
  durationMs?: number;
  trackNumber?: number;
  discNumber?: number;
  artwork?: ArtworkSet;
  tags?: string[];
  sources?: ProviderRef[];
  localFile?: LocalFileInfo;
  streams?: Stream[];
};

export type Album = {
  title: string;
  artists: Credit[];
  tracks?: Track[];
  releaseDateIso?: string;
  genres?: string[];
  artwork?: ArtworkSet;
  sources?: ProviderRef[];
};

export type Artist = {
  name: string;
  kind?: 'person' | 'group';
  disambiguation?: string;
  artwork?: ArtworkSet;
  tags?: string[];
  sources?: ProviderRef[];
};

export type Playlist = {
  id: string;
  name: string;
  lastModifiedIso?: string;
  items: PlaylistItem[];
};

export type PlaylistItem = {
  title: string;
  artists: Credit[];
  album?: string;
  durationMs?: number;
  artwork?: ArtworkSet;
  note?: string;
  addedAtIso?: string;
  sources?: ProviderRef[];
};
