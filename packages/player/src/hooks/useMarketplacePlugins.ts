import { useQuery } from '@tanstack/react-query';

import {
  pluginMarketplaceApi,
  type MarketplacePlugin,
} from '../apis/pluginMarketplaceApi';

export const MARKETPLACE_QUERY_KEY = ['marketplace-plugins'];

export const useMarketplacePlugins = () => {
  return useQuery<MarketplacePlugin[]>({
    queryKey: MARKETPLACE_QUERY_KEY,
    queryFn: () => pluginMarketplaceApi.getPlugins(),
    staleTime: 5 * 60 * 1000,
  });
};
