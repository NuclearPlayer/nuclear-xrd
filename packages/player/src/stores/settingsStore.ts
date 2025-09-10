import { LazyStore } from '@tauri-apps/plugin-store';
import { create } from 'zustand';

import type {
  SettingDefinition,
  SettingsHost,
  SettingSource,
  SettingValue,
} from '@nuclearplayer/plugin-sdk';

const SETTINGS_FILE = 'settings.json';
const store = new LazyStore(SETTINGS_FILE);

type Registry = Record<string, SettingDefinition>;
type Values = Record<string, SettingValue>;

type State = {
  definitions: Registry;
  values: Values;
  loaded: boolean;
  loadFromDisk: () => Promise<void>;
  register: (
    definitions: SettingDefinition[],
    source: SettingSource,
  ) => string[];
  getValue: (fullyQualifiedId: string) => SettingValue;
  setValue: (fullyQualifiedId: string, value: SettingValue) => Promise<void>;
};

export const useSettingsStore = create<State>((set, get) => ({
  definitions: {},
  values: {},
  loaded: false,
  loadFromDisk: async () => {
    const storeEntries = await store.entries();
    const loadedValues: Values = {};
    for (const [key, entryValue] of storeEntries) {
      loadedValues[String(key)] = entryValue as SettingValue;
    }
    set({ values: loadedValues, loaded: true });
  },
  register: (definitions, source) => {
    const fullyQualifiedIds: string[] = [];
    const definitionsMap: Registry = { ...get().definitions };
    for (const definition of definitions) {
      const fullyQualifiedId = normalizeId(source, definition.id);
      const fullDefinition: SettingDefinition = {
        ...definition,
        id: fullyQualifiedId,
        source,
      };
      definitionsMap[fullyQualifiedId] = fullDefinition;
      fullyQualifiedIds.push(fullyQualifiedId);
    }
    set({ definitions: definitionsMap });
    return fullyQualifiedIds;
  },
  getValue: (fullyQualifiedId) => {
    const { values, definitions } = get();
    const currentValue = values[fullyQualifiedId];
    if (currentValue !== undefined) {
      return currentValue;
    }
    return definitions[fullyQualifiedId]?.default;
  },
  setValue: async (fullyQualifiedId, value) => {
    const nextValues = { ...get().values, [fullyQualifiedId]: value };
    set({ values: nextValues });
    await store.set(fullyQualifiedId, value as unknown);
    await store.save();
  },
}));

const normalizeId = (source: SettingSource, id: string): string => {
  if (source.type === 'plugin') {
    return `plugin.${source.pluginId}.${id}`;
  }
  return `core.${id}`;
};

export const initializeSettingsStore = async (): Promise<void> => {
  await useSettingsStore.getState().loadFromDisk();
};

export const createPluginSettingsHost = (
  pluginId: string,
  pluginName?: string,
): SettingsHost => {
  const pluginSource: SettingSource = { type: 'plugin', pluginId, pluginName };
  return {
    register: async (
      definitions: SettingDefinition[],
      _source: SettingSource,
    ) => {
      void _source;
      const registeredIds = useSettingsStore
        .getState()
        .register(definitions, pluginSource);
      return { registered: registeredIds };
    },
    get: async <T extends SettingValue = SettingValue>(id: string) => {
      const fullyQualifiedId = normalizeId(pluginSource, id);
      const currentValue = useSettingsStore
        .getState()
        .getValue(fullyQualifiedId);
      return currentValue as T | undefined;
    },
    set: async (id: string, value: SettingValue) => {
      const fullyQualifiedId = normalizeId(pluginSource, id);
      await useSettingsStore.getState().setValue(fullyQualifiedId, value);
    },
    subscribe: <T extends SettingValue = SettingValue>(
      id: string,
      listener: (value: T | undefined) => void,
    ) => {
      const fullyQualifiedId = normalizeId(pluginSource, id);
      let previousValue = useSettingsStore
        .getState()
        .getValue(fullyQualifiedId) as T | undefined;
      const unsubscribe = useSettingsStore.subscribe((state) => {
        const nextValue = state.getValue(fullyQualifiedId) as T | undefined;
        if (nextValue !== previousValue) {
          previousValue = nextValue;
          listener(nextValue);
        }
      });
      return unsubscribe;
    },
  };
};

export const registerCoreSettings = (
  definitions: SettingDefinition[],
): string[] => {
  return useSettingsStore.getState().register(definitions, { type: 'core' });
};

export const getSetting = (fullyQualifiedId: string): SettingValue =>
  useSettingsStore.getState().getValue(fullyQualifiedId);

export const setSetting = async (
  fullyQualifiedId: string,
  value: SettingValue,
): Promise<void> =>
  useSettingsStore.getState().setValue(fullyQualifiedId, value);

export const createCoreSettingsHost = (): SettingsHost => {
  const coreSource: SettingSource = { type: 'core' };
  return {
    register: async (definitions) => {
      const registeredIds = useSettingsStore
        .getState()
        .register(definitions, coreSource);
      return { registered: registeredIds };
    },
    get: async <T extends SettingValue = SettingValue>(id: string) => {
      const fullyQualifiedId = normalizeId(coreSource, id);
      const currentValue = useSettingsStore
        .getState()
        .getValue(fullyQualifiedId);
      return currentValue as T | undefined;
    },
    set: async (id: string, value: SettingValue) => {
      const fullyQualifiedId = normalizeId(coreSource, id);
      await useSettingsStore.getState().setValue(fullyQualifiedId, value);
    },
    subscribe: <T extends SettingValue = SettingValue>(
      id: string,
      listener: (value: T | undefined) => void,
    ) => {
      const fullyQualifiedId = normalizeId(coreSource, id);
      let previousValue = useSettingsStore
        .getState()
        .getValue(fullyQualifiedId) as T | undefined;
      const unsubscribe = useSettingsStore.subscribe((state) => {
        const nextValue = state.getValue(fullyQualifiedId) as T | undefined;
        if (nextValue !== previousValue) {
          previousValue = nextValue;
          listener(nextValue);
        }
      });
      return unsubscribe;
    },
  };
};

export const coreSettingsHost: SettingsHost = createCoreSettingsHost();
