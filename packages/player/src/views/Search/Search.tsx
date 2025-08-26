import { useQuery } from '@tanstack/react-query';
import { useMemo, type FC } from 'react';

import { pickArtwork } from '@nuclearplayer/model';
import type {
  MetadataProvider,
  SearchResults,
} from '@nuclearplayer/plugin-sdk';
import {
  Button,
  Card,
  CardGrid,
  Loader,
  Tabs,
  TabsItem,
} from '@nuclearplayer/ui';

import { Route } from '../../routes/search';
import { providersServiceHost } from '../../services/providersService';
import { executeMetadataSearch } from '../../services/search/executeMetadataSearch';

export const Search: FC = () => {
  const { q } = Route.useSearch();

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
    queryKey: ['metadata-search', provider?.id, q],
    queryFn: () =>
      executeMetadataSearch(provider as MetadataProvider, { query: q }),
    enabled: Boolean(provider && q),
  });

  const tabsItems = [
    results?.albums && {
      id: 'albums',
      label: 'Albums',
      content: (
        <CardGrid>
          {results.albums.map((item) => (
            <Card
              title={item.title}
              src={pickArtwork(item.artwork, 'cover', 300)?.url}
            />
          ))}
        </CardGrid>
      ),
    },
    results?.artists && {
      id: 'artists',
      label: 'Artists',
      content: (
        <CardGrid>
          {results.artists.map((item) => (
            <Card
              title={item.name}
              src={pickArtwork(item.artwork, 'cover', 300)?.url}
            />
          ))}
        </CardGrid>
      ),
    },
    results?.tracks && {
      id: 'tracks',
      label: 'Tracks',
      content: (
        <div className="flex flex-col">
          {results.tracks.map((item) => (
            <span>
              {item.artists[0].name} - {item.title}
            </span>
          ))}
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="space-y-6 p-4" data-testid="search-view">
      <div className="space-y-1">
        <h1>Search</h1>
        <div className="text-sm opacity-70">
          {q ? `Query: "${q}"` : 'No query'}
        </div>
        <div className="text-sm opacity-70">
          {provider ? `Provider: ${provider.name}` : 'No provider'}
        </div>
      </div>

      {!q || !provider ? (
        <div className="opacity-70">Nothing to search.</div>
      ) : isLoading ? (
        <Loader size="xl" />
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
        <Tabs items={tabsItems as TabsItem[]} />
      )}
    </div>
  );
};
