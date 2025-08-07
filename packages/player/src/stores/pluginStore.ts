import { create } from 'zustand';

import type { NuclearPlugin } from '@nuclearplayer/plugin-sdk';
import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

import { PluginLoader } from '../services/PluginLoader';

const VALID_TRANSITIONS: Record<PluginStatus, PluginStatus[]> = {
  loaded: ['enabled', 'failed'],
  enabled: ['disabled', 'failed'],
  disabled: ['enabled', 'failed'],
  failed: ['failed'],
} as const;

const transitionPluginState = (
  pluginId: string,
  targetStatus: PluginState['status'],
  overrides: Partial<PluginState> = {},
) => {
  const plugin = usePluginStore.getState().getPlugin(pluginId);

  if (!plugin) {
    throw new Error(`Plugin ${pluginId} not found`);
  }

  if (!VALID_TRANSITIONS[plugin.status].includes(targetStatus)) {
    throw new Error(
      `Plugin ${pluginId} cannot be ${targetStatus} from status: ${plugin.status}`,
    );
  }

  usePluginStore.setState((state) => ({
    plugins: {
      ...state.plugins,
      [pluginId]: {
        ...state.plugins[pluginId],
        status: targetStatus,
        ...overrides,
      },
    },
  }));
};

const createErrorInfo = (error: unknown) => ({
  message: String(error),
  stack: error instanceof Error ? error.stack : undefined,
  timestamp: new Date().valueOf(),
});

const requireInstance = (get: () => PluginStore, id: string) => {
  const plugin = get().plugins[id];
  if (!plugin) throw new Error(`Plugin ${id} not found`);
  if (!plugin.instance) throw new Error(`Plugin ${id} has no instance`);
  return plugin;
};

export type PluginStatus = 'loaded' | 'enabled' | 'disabled' | 'failed';

export type PluginState = {
  id: string;
  name: string;
  version: string;
  path: string;
  status: PluginStatus;
  error?: {
    message: string;
    stack?: string;
    timestamp: number;
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

    const loadedPlugin = await loader.load();

    const existingPlugin = get().plugins[loadedPlugin.id];
    if (existingPlugin) {
      throw new Error(`Plugin ${loadedPlugin.id} is already loaded`);
    }

    set((state) => ({
      plugins: {
        ...state.plugins,
        [loadedPlugin.id]: {
          status: 'loaded',
          ...loadedPlugin,
        },
      },
    }));
  },

  enablePlugin: async (id: string) => {
    const plugin = get().plugins[id];
    requireInstance(get, id);

    try {
      if (plugin.instance!.onEnable) {
        const api = new NuclearPluginAPI();
        await plugin.instance!.onEnable(api);
      }

      transitionPluginState(id, 'enabled', { error: undefined });
    } catch (error) {
      transitionPluginState(id, 'failed', { error: createErrorInfo(error) });
      throw error;
    }
  },

  disablePlugin: async (id: string) => {
    const plugin = get().plugins[id];
    requireInstance(get, id);

    try {
      if (plugin.instance!.onDisable) {
        await plugin.instance!.onDisable();
      }

      transitionPluginState(id, 'disabled', { error: undefined });
    } catch (error) {
      transitionPluginState(id, 'failed', { error: createErrorInfo(error) });
      throw error;
    }
  },

  unloadPlugin: async (id: string) => {
    const plugin = get().plugins[id];
    if (!plugin) {
      throw new Error(`Plugin ${id} not found`);
    }

    let unloadError: unknown = null;

    try {
      if (plugin.status === 'enabled') {
        await get().disablePlugin(id);
      }

      if (plugin.instance?.onUnload) {
        await plugin.instance.onUnload();
      }
    } catch (error) {
      unloadError = error;
    }

    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: removedPlugin, ...remainingPlugins } = state.plugins;
      return {
        plugins: remainingPlugins,
      };
    });

    if (unloadError) {
      throw unloadError;
    }
  },

  getPlugin: (id: string) => {
    return get().plugins[id];
  },

  getAllPlugins: () => {
    return Object.values(get().plugins);
  },
}));
