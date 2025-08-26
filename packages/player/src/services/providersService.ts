import type {
  ProviderDescriptor,
  ProviderKind,
  ProvidersHost,
} from '@nuclearplayer/plugin-sdk';

class ProvidersService implements ProvidersHost {
  #byKind = new Map<ProviderKind, Map<string, ProviderDescriptor>>();
  #byId = new Map<string, ProviderDescriptor>();

  register<T extends ProviderDescriptor>(provider: T): string {
    const kindMap = this.#byKind.get(provider.kind) ?? new Map();
    kindMap.set(provider.id, provider);
    this.#byKind.set(provider.kind, kindMap);
    this.#byId.set(provider.id, provider);
    return provider.id;
  }

  unregister(providerId: string): boolean {
    const current = this.#byId.get(providerId);
    if (!current) {
      return false;
    }
    this.#byId.delete(providerId);
    const kindMap = this.#byKind.get(current.kind);
    if (kindMap) {
      kindMap.delete(providerId);
      if (kindMap.size === 0) {
        this.#byKind.delete(current.kind);
      }
    }
    return true;
  }

  list<K extends ProviderKind = ProviderKind>(kind?: K) {
    if (kind) {
      const map = this.#byKind.get(kind as ProviderKind);
      return (map ? Array.from(map.values()) : []) as ProviderDescriptor<K>[];
    }
    const all: ProviderDescriptor[] = [];
    for (const map of this.#byKind.values()) {
      for (const value of map.values()) {
        all.push(value);
      }
    }
    return all as ProviderDescriptor<K>[];
  }

  get<T extends ProviderDescriptor>(providerId: string) {
    return this.#byId.get(providerId) as T | undefined;
  }

  clear() {
    this.#byKind.clear();
    this.#byId.clear();
  }
}

export const providersServiceHost: ProvidersHost = new ProvidersService();
