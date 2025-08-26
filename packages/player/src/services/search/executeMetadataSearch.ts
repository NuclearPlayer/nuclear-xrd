import type {
  MetadataProvider,
  SearchCategory,
  SearchParams,
  SearchResults,
} from '@nuclearplayer/plugin-sdk';

const ALL_CATEGORIES: SearchCategory[] = [
  'artists',
  'albums',
  'tracks',
  'playlists',
];

const onlyCategories = (values: string[] | undefined): SearchCategory[] => {
  if (!values) {
    return [];
  }

  // Dedupe categories and filter out junk
  const set = new Set<SearchCategory>(ALL_CATEGORIES);
  return values.filter((v): v is SearchCategory =>
    set.has(v as SearchCategory),
  );
};

const resolveTypes = (
  provider: MetadataProvider,
  requested: SearchCategory[] | undefined,
): SearchCategory[] => {
  return requested ?? onlyCategories(provider.capabilities);
};

export const executeMetadataSearch = async (
  provider: MetadataProvider,
  params: SearchParams,
): Promise<SearchResults> => {
  const unified = provider.capabilities?.includes('unified') && provider.search;
  if (unified) {
    return provider.search!(params);
  }

  const types = resolveTypes(provider, params.types);
  const want = new Set(types);

  const artistsPromise =
    want.has('artists') && provider.searchArtists
      ? provider.searchArtists({ query: params.query, limit: params.limit })
      : undefined;
  const albumsPromise =
    want.has('albums') && provider.searchAlbums
      ? provider.searchAlbums({ query: params.query, limit: params.limit })
      : undefined;
  const tracksPromise =
    want.has('tracks') && provider.searchTracks
      ? provider.searchTracks({ query: params.query, limit: params.limit })
      : undefined;
  const playlistsPromise =
    want.has('playlists') && provider.searchPlaylists
      ? provider.searchPlaylists({ query: params.query, limit: params.limit })
      : undefined;

  const [artists, albums, tracks, playlists] = await Promise.all([
    artistsPromise ?? Promise.resolve(undefined),
    albumsPromise ?? Promise.resolve(undefined),
    tracksPromise ?? Promise.resolve(undefined),
    playlistsPromise ?? Promise.resolve(undefined),
  ]);

  const result: SearchResults = {};
  if (artists) {
    result.artists = artists;
  }
  if (albums) {
    result.albums = albums;
  }
  if (tracks) {
    result.tracks = tracks;
  }
  if (playlists) {
    result.playlists = playlists;
  }
  return result;
};
