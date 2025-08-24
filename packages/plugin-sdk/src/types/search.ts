import type { Album, Artist, Playlist, Track } from '@nuclearplayer/model';

export type SearchCategory = 'artists' | 'albums' | 'tracks' | 'playlists';

export type SearchCapability = SearchCategory | 'unified';

export type SearchParams = {
  query: string;
  types?: SearchCategory[];
  limit?: number;
};

export type SearchResults = {
  artists?: Artist[];
  albums?: Album[];
  tracks?: Track[];
  playlists?: Playlist[];
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
  searchArtists?: (params: Omit<SearchParams, 'types'>) => Promise<Artist[]>;
  searchAlbums?: (params: Omit<SearchParams, 'types'>) => Promise<Album[]>;
  searchTracks?: (params: Omit<SearchParams, 'types'>) => Promise<Track[]>;
  searchPlaylists?: (
    params: Omit<SearchParams, 'types'>,
  ) => Promise<Playlist[]>;
};

export type ProviderDecorator<
  T extends ProviderDescriptor = ProviderDescriptor,
> = (current: T) => T;
