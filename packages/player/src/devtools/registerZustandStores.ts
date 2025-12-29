import { useAdvancedThemeStore } from '../stores/advancedThemeStore';
import { useLayoutStore } from '../stores/layoutStore';
import { usePluginStore } from '../stores/pluginStore';
import { useQueueStore } from '../stores/queueStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';
import { useStartupStore } from '../stores/startupStore';
import { registerZustandStore } from './zustandRegistry';

export const registerZustandStores = (): void => {
  registerZustandStore({
    name: 'Queue',
    getState: useQueueStore.getState,
    subscribe: useQueueStore.subscribe,
  });

  registerZustandStore({
    name: 'Settings',
    getState: useSettingsStore.getState,
    subscribe: useSettingsStore.subscribe,
  });

  registerZustandStore({
    name: 'Sound',
    getState: useSoundStore.getState,
    subscribe: useSoundStore.subscribe,
  });

  registerZustandStore({
    name: 'Plugins',
    getState: usePluginStore.getState,
    subscribe: usePluginStore.subscribe,
  });

  registerZustandStore({
    name: 'Layout',
    getState: useLayoutStore.getState,
    subscribe: useLayoutStore.subscribe,
  });

  registerZustandStore({
    name: 'Themes',
    getState: useAdvancedThemeStore.getState,
    subscribe: useAdvancedThemeStore.subscribe,
  });

  registerZustandStore({
    name: 'Startup',
    getState: useStartupStore.getState,
    subscribe: useStartupStore.subscribe,
  });
};
