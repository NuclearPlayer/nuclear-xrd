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

import { PluginLoader } from '../services/plugins/PluginLoader';
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
      const loader = new PluginLoader(path);
      const loaded: LoadedPlugin = await loader.load();
      const id = loaded.metadata.id;
      if (get().plugins[id]) {
        Logger.debug(`Plugin ${id} already loaded.`);
        return;
      }
      const permissions = loaded.metadata.permissions || [];
      const unknown = permissions.filter(
        (p) => !allowedPermissions.includes(p),
      );
      const warnings: string[] = unknown.length
        ? [`Unknown permissions: ${unknown.join(', ')}`]
        : [];

      if (warnings.length > 0) {
        Logger.warn(
          `Plugin ${id} loaded with warnings: ${warnings.join(', ')}`,
        );
      }

      set((state) => ({
        plugins: {
          ...state.plugins,
          [loaded.metadata.id]: {
            metadata: loaded.metadata,
            path: loaded.path,
            enabled: false,
            warning: warnings.length > 0,
            warnings,
            instance: loaded.instance,
          },
        },
      }));
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
