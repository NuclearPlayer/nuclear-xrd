import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  pluginMarketplaceApi,
  type MarketplacePlugin,
} from '../apis/pluginMarketplaceApi';
import {
  cleanupDownload,
  downloadAndExtractPlugin,
} from '../services/plugins/pluginDownloader';
import { upsertRegistryEntry } from '../services/plugins/pluginRegistry';
import { usePluginStore } from '../stores/pluginStore';
import { MARKETPLACE_QUERY_KEY } from './useMarketplacePlugins';

type InstallPluginParams = {
  plugin: MarketplacePlugin;
  onProgress?: (percent: number) => void;
};

export const useInstallPlugin = () => {
  const queryClient = useQueryClient();
  const loadPluginFromPath = usePluginStore((s) => s.loadPluginFromPath);

  return useMutation({
    mutationFn: async ({ plugin, onProgress }: InstallPluginParams) => {
      const release = await pluginMarketplaceApi.getLatestRelease(plugin.repo);

      const extractedPath = await downloadAndExtractPlugin({
        pluginId: plugin.id,
        downloadUrl: release.downloadUrl,
        onProgress: onProgress
          ? (p) => onProgress((p.progress / p.total) * 100)
          : undefined,
      });

      const now = new Date().toISOString();
      await upsertRegistryEntry({
        id: plugin.id,
        version: release.version,
        path: '',
        installationMethod: 'store',
        enabled: false,
        installedAt: now,
        lastUpdatedAt: now,
      });

      await loadPluginFromPath(extractedPath);

      await cleanupDownload(plugin.id);

      return { plugin, version: release.version };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_QUERY_KEY });
    },
  });
};
