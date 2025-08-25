import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { useMemo, type FC } from 'react';

import type {
  MetadataProvider,
  SearchResults,
} from '@nuclearplayer/plugin-sdk';
import { Button } from '@nuclearplayer/ui';

import { providersServiceHost } from '../services/providersService';
import { executeMetadataSearch } from '../services/search/executeMetadataSearch';

export const Search: FC = () => {
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search ?? ''),
    [location.search],
  );
  const query = searchParams.get('q') ?? '';

  // @todo: this selects the first metadata provider, when we support switching it should use the selected one
  const provider = useMemo(() => {
    const providers = providersServiceHost.list(
      'metadata',
    ) as MetadataProvider[];
    return providers[0];
  }, []);

  const {
    data: results,
    isLoading,
    isError,
    refetch,
  } = useQuery<SearchResults>({
    queryKey: ['metadata-search', provider?.id, query],
    queryFn: () =>
      executeMetadataSearch(provider as MetadataProvider, { query }),
    enabled: Boolean(provider && query),
  });

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-1">
        <h1>Search</h1>
        <div className="text-sm opacity-70">
          {query ? `Query: "${query}"` : 'No query'}
        </div>
        <div className="text-sm opacity-70">
          {provider ? `Provider: ${provider.name}` : 'No provider'}
        </div>
      </div>

      {!query || !provider ? (
        <div className="opacity-70">Nothing to search.</div>
      ) : isLoading ? (
        <div className="opacity-70">Loading…</div>
      ) : isError ? (
        <div className="space-y-3">
          <div className="text-accent-red">Failed to load results.</div>
          <Button
            onClick={() => {
              void refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {results?.tracks && (
            <section className="space-y-2">
              <h2>Tracks ({results.tracks.length})</h2>
            </section>
          )}
          {results?.artists && (
            <section className="space-y-2">
              <h2>Artists ({results.artists.length})</h2>
            </section>
          )}
          {results?.albums && (
            <section className="space-y-2">
              <h2>Albums ({results.albums.length})</h2>
            </section>
          )}
          {results?.playlists && (
            <section className="space-y-2">
              <h2>Playlists ({results.playlists.length})</h2>
            </section>
          )}
          {!results?.tracks &&
            !results?.artists &&
            !results?.albums &&
            !results?.playlists && (
              <div className="opacity-70">No results.</div>
            )}
        </div>
      )}
    </div>
  );
};
