import type {
  ProviderDescriptor,
  ProviderKind,
  ProvidersHost,
} from '@nuclearplayer/plugin-sdk';

export const createProvidersHost = (): ProvidersHost => {
  const byKind = new Map<ProviderKind, Map<string, ProviderDescriptor>>();
  const byId = new Map<string, ProviderDescriptor>();

  return {
    register<T extends ProviderDescriptor>(provider: T): string {
      const kindMap = byKind.get(provider.kind) ?? new Map();
      kindMap.set(provider.id, provider);
      byKind.set(provider.kind, kindMap);
      byId.set(provider.id, provider);
      return provider.id;
    },

    unregister(providerId: string): boolean {
      const current = byId.get(providerId);
      if (!current) {
        return false;
      }
      byId.delete(providerId);
      const kindMap = byKind.get(current.kind);
      if (kindMap) {
        kindMap.delete(providerId);
        if (kindMap.size === 0) {
          byKind.delete(current.kind);
        }
      }
      return true;
    },

    list<K extends ProviderKind = ProviderKind>(kind?: K) {
      if (kind) {
        const map = byKind.get(kind as ProviderKind);
        return (map ? Array.from(map.values()) : []) as ProviderDescriptor<K>[];
      }
      const all: ProviderDescriptor[] = [];
      for (const map of byKind.values()) {
        for (const value of map.values()) {
          all.push(value);
        }
      }
      return all as ProviderDescriptor<K>[];
    },

    get<T extends ProviderDescriptor>(providerId: string) {
      return byId.get(providerId) as T | undefined;
    },

    clear() {
      byKind.clear();
      byId.clear();
    },
  };
};

export const providersHost: ProvidersHost = createProvidersHost();
