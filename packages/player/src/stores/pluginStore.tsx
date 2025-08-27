import { join } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';
import * as Logger from '@tauri-apps/plugin-log';
import { isError, isString } from 'lodash-es';
import { toast } from 'sonner';
import { create } from 'zustand';

import type {
  LoadedPlugin,
  NuclearPlugin,
  PluginMetadata,
} from '@nuclearplayer/plugin-sdk';
import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

import { PluginLoader } from '../services/PluginLoader';
import { safeParsePluginManifest } from '../services/pluginManifest';
import {
  getRegistryEntry,
  setRegistryWarnings,
  upsertRegistryEntry,
} from '../services/pluginRegistry';
import { installPluginToManagedDir } from '../services/pluginsDirService';
import { providersServiceHost } from '../services/providersService';
import { createPluginSettingsHost } from './settingsStore';

const allowedPermissions: string[] = [];

export type PluginState = {
  metadata: PluginMetadata;
  path: string;
  enabled: boolean;
  warning: boolean;
  warnings: string[];
  instance?: NuclearPlugin;
};

type PluginStore = {
  plugins: Record<string, PluginState>;
  loadPluginFromPath: (path: string) => Promise<void>;
  unloadPlugin: (id: string) => Promise<void>;
  enablePlugin: (id: string) => Promise<void>;
  disablePlugin: (id: string) => Promise<void>;
  getPlugin: (id: string) => PluginState | undefined;
  getAllPlugins: () => PluginState[];
};

const requireInstance = (id: string) => {
  const plugin = usePluginStore.getState().plugins[id];
  if (!plugin) throw new Error(`Plugin ${id} not found`);
  if (!plugin.instance) throw new Error(`Plugin ${id} has no instance`);
  return plugin;
};

export const usePluginStore = create<PluginStore>((set, get) => ({
  plugins: {},

  loadPluginFromPath: async (path: string) => {
    try {
      // 1) Read manifest to get id/version without executing plugin code
      const pkgPath = await join(path, 'package.json');
      const pkgText = await readTextFile(pkgPath);
      const manifestResult = safeParsePluginManifest(JSON.parse(pkgText));
      if (!manifestResult.success) {
        const msg = manifestResult.errors.join('; ');
        toast.error('Failed to load plugin', { description: `${msg}` });
        Logger.error(`Invalid plugin package.json: ${msg}`);
        return;
      }
      const { name: id, version } = manifestResult.data;

      // 2) Copy folder into managed directory (overwrite semantics)
      const managedPath = await installPluginToManagedDir(id, version, path);

      // 3) Persist/merge registry entry (preserve enabled state if present)
      const existing = await getRegistryEntry(id);
      const now = new Date().toISOString();
      const enabled = existing ? existing.enabled : false;
      await upsertRegistryEntry({
        id,
        version,
        path: managedPath,
        location: 'user',
        enabled,
        installedAt: existing ? existing.installedAt : now,
        lastUpdatedAt: now,
        warnings: undefined,
      });

      // 4) Load plugin from managed path
      const loader = new PluginLoader(managedPath);
      const loaded: LoadedPlugin = await loader.load();
      const permissions = loaded.metadata.permissions || [];
      const unknown = permissions.filter((p) => {
        return !allowedPermissions.includes(p);
      });
      const combinedWarnings: string[] = [];
      if (manifestResult.warnings.length > 0) {
        combinedWarnings.push(...manifestResult.warnings);
      }
      if (unknown.length > 0) {
        combinedWarnings.push(`Unknown permissions: ${unknown.join(', ')}`);
      }
      if (combinedWarnings.length > 0) {
        await setRegistryWarnings(id, combinedWarnings);
        Logger.warn(
          `Plugin ${id} loaded with warnings: ${combinedWarnings.join(', ')}`,
        );
      }

      set((state) => ({
        plugins: {
          ...state.plugins,
          [loaded.metadata.id]: {
            metadata: loaded.metadata,
            path: managedPath,
            enabled: false,
            warning: combinedWarnings.length > 0,
            warnings: combinedWarnings,
            instance: loaded.instance,
          },
        },
      }));

      // 5) Enable the plugin if it was previously enabled
      if (enabled) {
        await get().enablePlugin(id);
      }
    } catch (error) {
      toast.error('Failed to load plugin', {
        description: `${isError(error) ? (error as Error).message : isString(error) ? (error as string) : 'Unknown error'}`,
      });
      Logger.error(`Failed to load plugin: ${(error as Error).message}`);
    }
  },

  enablePlugin: async (id: string) => {
    const plugin = requireInstance(id);
    if (plugin.enabled) {
      Logger.debug(`Plugin ${id} is already enabled.`);
      return;
    }
    if (plugin.instance!.onEnable) {
      const api = new NuclearPluginAPI({
        settingsHost: createPluginSettingsHost(id, plugin.metadata.displayName),
        providersHost: providersServiceHost,
      });
      await plugin.instance!.onEnable(api);
    }
    set((state) => ({
      plugins: {
        ...state.plugins,
        [id]: { ...state.plugins[id], enabled: true },
      },
    }));
  },

  disablePlugin: async (id: string) => {
    const plugin = requireInstance(id);
    if (!plugin.enabled) {
      Logger.debug(`Plugin ${id} is already disabled.`);
      return;
    }
    if (plugin.instance!.onDisable) {
      await plugin.instance!.onDisable();
    }
    set((state) => ({
      plugins: {
        ...state.plugins,
        [id]: { ...state.plugins[id], enabled: false },
      },
    }));
  },

  unloadPlugin: async (id: string) => {
    const plugin = get().plugins[id];
    if (!plugin) {
      Logger.error(`Plugin ${id} not found`);
      throw new Error(`Plugin ${id} not found`);
    }
    let unloadError: unknown = null;
    try {
      if (plugin.enabled) {
        await get().disablePlugin(id);
      }
      if (plugin.instance?.onUnload) {
        await plugin.instance.onUnload();
      }
    } catch (error) {
      unloadError = error;
    }

    // Plugin will be removed regardless of unload errors
    set((state) => {
      // _removed is intentionally unused
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _removed, ...rest } = state.plugins;
      return { plugins: rest };
    });

    if (unloadError) {
      Logger.error(
        `Failed to unload plugin ${id}. It was removed, but might not have been able to complete cleanup.`,
        unloadError,
      );
      throw unloadError;
    }
  },

  getPlugin: (id: string) => get().plugins[id],
  getAllPlugins: () => Object.values(get().plugins),
}));
