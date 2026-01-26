import { useMutation } from '@tanstack/react-query';

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

type InstallPluginParams = {
  plugin: MarketplacePlugin;
  onProgress?: (percent: number) => void;
};

export const useInstallPlugin = () => {
  const loadPluginFromPath = usePluginStore((s) => s.loadPluginFromPath);

  return useMutation({
    mutationFn: async ({ plugin, onProgress }: InstallPluginParams) => {
      const release = await pluginMarketplaceApi.getLatestRelease(plugin.repo);

      const extractedPath = await downloadAndExtractPlugin({
        pluginId: plugin.id,
        downloadUrl: release.downloadUrl,
        onProgress: onProgress
          ? (p) => {
              const percent = p.total > 0 ? (p.progress / p.total) * 100 : 0;
              onProgress(percent);
            }
          : undefined,
      });

      try {
        const now = new Date().toISOString();
        await upsertRegistryEntry({
          id: plugin.id,
          version: release.version,
          path: extractedPath,
          installationMethod: 'store',
          enabled: false,
          installedAt: now,
          lastUpdatedAt: now,
        });

        await loadPluginFromPath(extractedPath);
      } finally {
        await cleanupDownload(plugin.id);
      }

      return { plugin, version: release.version };
    },
  });
};
