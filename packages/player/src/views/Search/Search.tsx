import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMemo, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
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
  const { t } = useTranslation(['search', 'common']);
  const { q } = useSearch({ from: '/search' });
  const navigate = useNavigate();

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
      label: t('search:results.albums'),
      content: (
        <CardGrid>
          {results.albums.map((item) => (
            <Card
              key={item.source.id}
              title={item.title}
              src={pickArtwork(item.artwork, 'cover', 300)?.url}
              onClick={() =>
                navigate({ to: `/album/${provider.id}/${item.source.id}` })
              }
            />
          ))}
        </CardGrid>
      ),
    },
    results?.artists && {
      id: 'artists',
      label: t('search:results.artists'),
      content: (
        <CardGrid>
          {results.artists.map((item) => (
            <Card
              key={item.source.id}
              title={item.name}
              src={pickArtwork(item.artwork, 'cover', 300)?.url}
              onClick={() =>
                navigate({ to: `/artist/${provider.id}/${item.source.id}` })
              }
            />
          ))}
        </CardGrid>
      ),
    },
    results?.tracks && {
      id: 'tracks',
      label: t('search:results.tracks'),
      content: (
        <div className="flex flex-col">
          {results.tracks.map((item) => (
            <span key={item.source.id}>
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
      title={t('search:title')}
      subtitle={`${t('search:query')}: "${q}"`}
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader size="xl" />
        </div>
      ) : isError ? (
        <div className="space-y-3">
          <div className="text-accent-red">{t('search:failedToLoad')}</div>
          <Button
            onClick={() => {
              void refetch();
            }}
          >
            {t('common:actions.retry')}
          </Button>
        </div>
      ) : (
        <Tabs items={tabsItems as TabsItem[]} className="flex-1" />
      )}
    </ViewShell>
  );
};
