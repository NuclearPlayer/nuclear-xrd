import type {
  Album,
  AlbumRef,
  Artist,
  ArtistRef,
  PlaylistRef,
  Track,
  TrackRef,
} from '@nuclearplayer/model';

export type SearchCategory = 'artists' | 'albums' | 'tracks' | 'playlists';
export type SearchCapability = SearchCategory | 'unified';

export type ArtistMetadataCapability =
  | 'artistDetails'
  | 'artistAlbums'
  | 'artistTopTracks'
  | 'artistRelatedArtists';

export type AlbumMetadataCapability = 'albumDetails';

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

export type ProviderKind = 'metadata' | 'streaming' | 'lyrics' | (string & {});

export type ProviderDescriptor<K extends ProviderKind = ProviderKind> = {
  id: string;
  kind: K;
  name: string;
  pluginId?: string;
};

export type MetadataProvider = ProviderDescriptor<'metadata'> & {
  searchCapabilities?: SearchCapability[];
  artistMetadataCapabilities?: ArtistMetadataCapability[];
  albumMetadataCapabilities?: AlbumMetadataCapability[];
  search?: (params: SearchParams) => Promise<SearchResults>;
  searchArtists?: (params: Omit<SearchParams, 'types'>) => Promise<ArtistRef[]>;
  searchAlbums?: (params: Omit<SearchParams, 'types'>) => Promise<AlbumRef[]>;
  searchTracks?: (params: Omit<SearchParams, 'types'>) => Promise<Track[]>;
  searchPlaylists?: (
    params: Omit<SearchParams, 'types'>,
  ) => Promise<PlaylistRef[]>;

  fetchArtistDetails?: (query: string) => Promise<Artist>;
  fetchAlbumDetails?: (query: string) => Promise<Album>;
  fetchArtistAlbums?: (artistId: string) => Promise<AlbumRef[]>;
  fetchArtistTopTracks?: (artistId: string) => Promise<TrackRef[]>;
  fetchArtistRelatedArtists?: (artistId: string) => Promise<ArtistRef[]>;
};

export class MissingCapabilityError extends Error {
  constructor(capability: string) {
    super(`Missing capability: ${capability}`);
    this.name = 'MissingCapabilityError';
  }
}
