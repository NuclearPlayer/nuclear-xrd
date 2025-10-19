import * as Logger from '@tauri-apps/plugin-log';
import { produce } from 'immer';
import { toast } from 'sonner';
import { create } from 'zustand';

import type { NuclearPlugin, PluginMetadata } from '@nuclearplayer/plugin-sdk';
import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

import {
  installPluginToManagedDir,
  removeManagedPluginInstall,
} from '../services/plugins/pluginDir';
import { PluginLoader } from '../services/plugins/PluginLoader';
import {
  getRegistryEntry,
  PluginInstallationMethod,
  removeRegistryEntry,
  setRegistryEntryEnabled,
  upsertRegistryEntry,
} from '../services/plugins/pluginRegistry';
import { providersServiceHost } from '../services/providersService';
import { resolveErrorMessage } from '../utils/logging';
import { createPluginSettingsHost } from './settingsStore';

const allowedPermissions: string[] = [];

export type PluginState = {
  metadata: PluginMetadata;
  path: string;
  enabled: boolean;
  warning: boolean;
  warnings: string[];
  installationMethod: PluginInstallationMethod;
  originalPath?: string;
  instance?: NuclearPlugin;
  isLoading?: boolean;
};

type PluginStore = {
  plugins: Record<string, PluginState>;
  loadPluginFromPath: (path: string) => Promise<void>;
  unloadPlugin: (id: string) => Promise<void>;
  enablePlugin: (id: string) => Promise<void>;
  disablePlugin: (id: string) => Promise<void>;
  cleanupPluginInstance: (id: string) => Promise<void>;
  reloadPlugin: (id: string) => Promise<void>;
  removePlugin: (id: string) => Promise<void>;
  getPlugin: (id: string) => PluginState | undefined;
  getAllPlugins: () => PluginState[];
};

const requireInstance = (id: string) => {
  const plugin = usePluginStore.getState().plugins[id];
  if (!plugin) {
    throw new Error(`Plugin ${id} not found`);
  }
  if (!plugin.instance) {
    throw new Error(`Plugin ${id} has no instance`);
  }
  return plugin;
};

type LoadedPluginData = {
  metadata: PluginMetadata;
  managedPath: string;
  instance: NuclearPlugin;
  warnings: string[];
};

const loadPluginData = async (
  sourcePath: string,
  id: string,
  version: string,
): Promise<LoadedPluginData> => {
  const loader = new PluginLoader(sourcePath);
  const metadata = await loader.loadMetadata();

  const permissions = metadata.permissions || [];
  const unknownPermissions = permissions.filter(
    (p) => !allowedPermissions.includes(p),
  );
  const warnings: string[] = unknownPermissions.length
    ? [`Unknown permissions: ${unknownPermissions.join(', ')}`]
    : [];

  if (warnings.length > 0) {
    Logger.warn(`Plugin ${id} loaded with warnings: ${warnings.join(', ')}`);
  }

  const managedPath = await installPluginToManagedDir(id, version, sourcePath);
  const managedPluginLoader = new PluginLoader(managedPath);
  const { instance } = await managedPluginLoader.load();

  return { metadata, managedPath, instance, warnings };
};

export const usePluginStore = create<PluginStore>((set, get) => ({
  plugins: {},

  loadPluginFromPath: async (path: string) => {
    try {
      const loader = new PluginLoader(path);
      const metadata = await loader.loadMetadata();
      const id = metadata.id;

      if (get().plugins[id]) {
        Logger.debug(`Plugin ${id} already loaded.`);
        return;
      }

      const existing = await getRegistryEntry(id);
      const installationMethod: PluginInstallationMethod =
        existing?.installationMethod ?? 'dev';
      const originalPath =
        installationMethod === 'dev' ? path : existing?.originalPath;

      const {
        metadata: loadedMetadata,
        managedPath,
        instance,
        warnings,
      } = await loadPluginData(path, id, metadata.version);

      const now = new Date().toISOString();
      const enabled = existing ? existing.enabled : false;

      await upsertRegistryEntry({
        id,
        version: loadedMetadata.version,
        path: managedPath,
        installationMethod,
        originalPath,
        enabled,
        installedAt: existing ? existing.installedAt : now,
        lastUpdatedAt: now,
        warnings,
      });

      set(
        produce((state: PluginStore) => {
          state.plugins[id] = {
            metadata: loadedMetadata,
            path: managedPath,
            enabled: false,
            warning: warnings.length > 0,
            warnings,
            installationMethod,
            originalPath,
            instance,
          };
        }),
      );

      if (enabled) {
        await get().enablePlugin(id);
      }
    } catch (error) {
      const message = resolveErrorMessage(error);

      toast.error('Failed to load plugin', {
        description: message,
      });

      Logger.error(`Failed to load plugin: ${message}`);
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
    set(
      produce((state: PluginStore) => {
        state.plugins[id].enabled = true;
      }),
    );
    await setRegistryEntryEnabled(id, true);
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
    set(
      produce((state: PluginStore) => {
        state.plugins[id].enabled = false;
      }),
    );
    await setRegistryEntryEnabled(id, false);
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

  cleanupPluginInstance: async (id: string) => {
    const plugin = get().plugins[id];
    if (!plugin) {
      throw new Error(`Plugin ${id} not found`);
    }
    if (plugin.enabled) {
      await get().disablePlugin(id);
    }
    if (plugin.instance?.onUnload) {
      await plugin.instance.onUnload();
    }
  },

  reloadPlugin: async (id: string) => {
    const plugin = get().plugins[id];
    if (!plugin) {
      throw new Error(`Plugin ${id} not found`);
    }
    if (plugin.installationMethod !== 'dev') {
      // Should never happen - we don't show the reload button for non-dev plugins
      throw new Error(
        `Plugin ${id} cannot be reloaded. Reinstall it from the store.`,
      );
    }
    if (!plugin.originalPath) {
      throw new Error(`Plugin ${id} has no original path`);
    }

    const wasEnabled = plugin.enabled;
    const originalPath = plugin.originalPath;
    const currentVersion = plugin.metadata.version;

    try {
      set(
        produce((state: PluginStore) => {
          state.plugins[id].isLoading = true;
        }),
      );

      await get().cleanupPluginInstance(id);

      const loader = new PluginLoader(originalPath);
      const metadata = await loader.loadMetadata();
      const newVersion = metadata.version;

      const {
        metadata: loadedMetadata,
        managedPath,
        instance,
        warnings,
      } = await loadPluginData(originalPath, id, newVersion);

      const now = new Date().toISOString();
      const existingEntry = await getRegistryEntry(id);
      const installedAt =
        currentVersion === newVersion && existingEntry
          ? existingEntry.installedAt
          : now;

      await upsertRegistryEntry({
        id,
        version: loadedMetadata.version,
        path: managedPath,
        installationMethod: 'dev',
        originalPath,
        enabled: wasEnabled,
        installedAt,
        lastUpdatedAt: now,
        warnings,
      });

      set(
        produce((state: PluginStore) => {
          state.plugins[id] = {
            ...state.plugins[id],
            metadata: loadedMetadata,
            path: managedPath,
            enabled: false,
            warning: warnings.length > 0,
            warnings,
            instance,
            isLoading: false,
          };
        }),
      );

      if (wasEnabled) {
        await get().enablePlugin(id);
      }
    } catch (error) {
      set(
        produce((state: PluginStore) => {
          if (state.plugins[id]) {
            state.plugins[id].isLoading = false;
          }
        }),
      );
      const message = resolveErrorMessage(error);
      toast.error('Failed to reload plugin', {
        description: message,
      });
      Logger.error(`Failed to reload plugin ${id}: ${message}`);
      throw error;
    }
  },

  removePlugin: async (id: string) => {
    const plugin = get().plugins[id];
    const fallbackEntry = plugin ? undefined : await getRegistryEntry(id);
    if (!plugin && !fallbackEntry) {
      throw new Error(`Plugin ${id} not found`);
    }
    const managedPath = plugin ? plugin.path : fallbackEntry!.path;
    try {
      if (plugin) {
        await get().unloadPlugin(id);
      }
      await removeManagedPluginInstall(managedPath);
      await removeRegistryEntry(id);
    } catch (error) {
      const message = resolveErrorMessage(error);
      toast.error('Failed to remove plugin', {
        description: message,
      });
      Logger.error(`Failed to remove plugin ${id}: ${message}`);
      throw error;
    }
  },

  getPlugin: (id: string) => get().plugins[id],
  getAllPlugins: () => Object.values(get().plugins),
}));
