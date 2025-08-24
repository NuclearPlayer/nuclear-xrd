import type {
  ProviderDescriptor,
  ProviderKind,
  ProvidersHost,
} from '@nuclearplayer/plugin-sdk';

class ProvidersRegistry implements ProvidersHost {
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
    const p = this.#byId.get(providerId);
    if (!p) {
      return false;
    }
    this.#byId.delete(providerId);
    const kindMap = this.#byKind.get(p.kind);
    if (kindMap) {
      kindMap.delete(providerId);
      if (kindMap.size === 0) {
        this.#byKind.delete(p.kind);
      }
    }
    return true;
  }

  list<K extends ProviderKind = ProviderKind>(kind?: K) {
    if (kind) {
      const m = this.#byKind.get(kind as ProviderKind);
      return (m ? Array.from(m.values()) : []) as ProviderDescriptor<K>[];
    }
    const res: ProviderDescriptor[] = [];
    for (const m of this.#byKind.values()) {
      res.push(...m.values());
    }
    return res as ProviderDescriptor<K>[];
  }

  get<T extends ProviderDescriptor>(providerId: string) {
    return this.#byId.get(providerId) as T | undefined;
  }

  decorate<T extends ProviderDescriptor>(
    providerId: string,
    decorator: (p: T) => T,
  ) {
    const current = this.get<T>(providerId);
    if (!current) {
      return false;
    }
    this.unregister(providerId);
    this.register(decorator(current));
    return true;
  }
}

export const providersHost: ProvidersHost = new ProvidersRegistry();
