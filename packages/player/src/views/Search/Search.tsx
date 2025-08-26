import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
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
  ViewShell,
} from '@nuclearplayer/ui';

import { providersServiceHost } from '../../services/providersService';
import { executeMetadataSearch } from '../../services/search/executeMetadataSearch';

export const Search: FC = () => {
  const { q } = useSearch({ from: '/search' });

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
    <ViewShell
      data-testid="search-view"
      title="Search"
      subtitle={`Query: "${q}"`}
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader size="xl" />
        </div>
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
        <Tabs items={tabsItems as TabsItem[]} className="flex-1" />
      )}
    </ViewShell>
  );
};
