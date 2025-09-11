import type {
  AlbumRef,
  ArtistRef,
  PlaylistRef,
  TrackRef,
} from '@nuclearplayer/model';

export type SearchCategory = 'artists' | 'albums' | 'tracks' | 'playlists';

export type SearchCapability = SearchCategory | 'unified';

export type SearchParams = {
  query: string;
  types?: SearchCategory[];
  limit?: number;
};

export type SearchResults = {
  artists?: ArtistRef[];
  albums?: AlbumRef[];
  tracks?: TrackRef[];
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
  capabilities?: SearchCapability[];
  search?: (params: SearchParams) => Promise<SearchResults>;
  searchArtists?: (params: Omit<SearchParams, 'types'>) => Promise<ArtistRef[]>;
  searchAlbums?: (params: Omit<SearchParams, 'types'>) => Promise<AlbumRef[]>;
  searchTracks?: (params: Omit<SearchParams, 'types'>) => Promise<TrackRef[]>;
  searchPlaylists?: (
    params: Omit<SearchParams, 'types'>,
  ) => Promise<PlaylistRef[]>;
};
