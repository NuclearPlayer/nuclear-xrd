import { LazyStore } from '@tauri-apps/plugin-store';

const REGISTRY_FILE = 'plugins.json';
const PREFIX = 'plugins.';
const store = new LazyStore(REGISTRY_FILE);

export type PluginInstallationMethod = 'dev' | 'store';

export type PluginRegistryEntry = {
  id: string;
  version: string;
  path: string;
  installationMethod: PluginInstallationMethod;
  originalPath?: string;
  enabled: boolean;
  installedAt: string;
  lastUpdatedAt: string;
  warnings?: string[];
};

const keyFor = (id: string): string => `${PREFIX}${id}`;

export const listRegistryEntries = async (): Promise<PluginRegistryEntry[]> => {
  const entries = await store.entries();
  const res: PluginRegistryEntry[] = [];
  Array.from(entries).forEach(([key, value]) => {
    if (String(key).startsWith(PREFIX)) {
      res.push(value as PluginRegistryEntry);
    }
  });
  return res;
};

export const getRegistryEntry = async (
  id: string,
): Promise<PluginRegistryEntry | undefined> => {
  const value = await store.get<PluginRegistryEntry | undefined>(keyFor(id));
  if (value) {
    return value;
  }
  return undefined;
};

export const upsertRegistryEntry = async (
  entry: PluginRegistryEntry,
): Promise<void> => {
  await store.set(keyFor(entry.id), entry);
  await store.save();
};

export const setRegistryEntryEnabled = async (
  id: string,
  enabled: boolean,
): Promise<void> => {
  const current = await getRegistryEntry(id);
  if (!current) {
    return;
  }
  const next: PluginRegistryEntry = { ...current, enabled };
  await store.set(keyFor(id), next);
  await store.save();
};

export const setRegistryEntryWarnings = async (
  id: string,
  warnings: string[],
): Promise<void> => {
  const current = await getRegistryEntry(id);
  if (!current) {
    return;
  }
  const next: PluginRegistryEntry = {
    ...current,
    warnings: warnings.length ? warnings : undefined,
  };
  await store.set(keyFor(id), next);
  await store.save();
};

export const removeRegistryEntry = async (id: string): Promise<void> => {
  await store.delete(keyFor(id));
  await store.save();
};
