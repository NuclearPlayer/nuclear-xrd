import { create } from 'zustand';

import type { NuclearPlugin } from '@nuclearplayer/plugin-sdk';

import { PluginLoader } from '../services/PluginLoader';

export type PluginState = {
  id: string;
  name: string;
  version: string;
  path: string;
  status: 'loaded' | 'enabled' | 'disabled' | 'failed';
  error?: {
    message: string;
    stack?: string;
    timestamp: Date;
  };
  instance?: NuclearPlugin;
};

type PluginStore = {
  plugins: Record<string, PluginState>;
  loadPlugin: (path: string) => Promise<void>;
  unloadPlugin: (id: string) => Promise<void>;
  enablePlugin: (id: string) => Promise<void>;
  disablePlugin: (id: string) => Promise<void>;
  getPlugin: (id: string) => PluginState | undefined;
  getAllPlugins: () => PluginState[];
};

export const usePluginStore = create<PluginStore>((set, get) => ({
  plugins: {},

  loadPlugin: async (path: string) => {
    const loader = new PluginLoader(path);

    try {
      const loadedPlugin = await loader.load();

      const existingPlugin = get().plugins[loadedPlugin.id];
      if (existingPlugin) {
        throw new Error(`Plugin ${loadedPlugin.id} is already loaded`);
      }

      set((state) => ({
        plugins: {
          ...state.plugins,
          [loadedPlugin.id]: {
            id: loadedPlugin.id,
            name: loadedPlugin.name,
            version: loadedPlugin.version,
            path: loadedPlugin.path,
            status: 'loaded',
            instance: loadedPlugin.instance,
          },
        },
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;

      let pluginId = path;
      try {
        const manifest = await loader.readManifest();
        pluginId = manifest.name;
      } catch {
        /* empty */
      }

      set((state) => ({
        plugins: {
          ...state.plugins,
          [pluginId]: {
            id: pluginId,
            name: pluginId,
            version: 'unknown',
            path,
            status: 'failed',
            error: {
              message: errorMessage,
              stack: errorStack,
              timestamp: new Date(),
            },
          },
        },
      }));

      throw error;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unloadPlugin: async (id: string) => {
    // Implementation will be added in task 4
    throw new Error('unloadPlugin not implemented yet');
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enablePlugin: async (id: string) => {
    // Implementation will be added in task 4
    throw new Error('enablePlugin not implemented yet');
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disablePlugin: async (id: string) => {
    // Implementation will be added in task 4
    throw new Error('disablePlugin not implemented yet');
  },

  getPlugin: (id: string) => {
    return get().plugins[id];
  },

  getAllPlugins: () => {
    return Object.values(get().plugins);
  },
}));
