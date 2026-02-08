const stores = new Map<string, Map<string, unknown>>();

export class LazyStore {
  #path: string;

  constructor(path: string) {
    this.#path = path;
    if (!stores.has(path)) {
      stores.set(path, new Map());
    }
  }

  async entries() {
    let map = stores.get(this.#path);
    if (!map) {
      map = new Map<string, unknown>();
      stores.set(this.#path, map);
    }
    return Array.from(map.entries());
  }

  async get<T>(key: string): Promise<T | null> {
    const map = stores.get(this.#path);
    if (!map) {
      return null;
    }
    return map.get(key) as T | null;
  }

  async set(key: string, value: unknown) {
    let map = stores.get(this.#path);
    if (!map) {
      map = new Map<string, unknown>();
      stores.set(this.#path, map);
    }
    map.set(String(key), value);
  }

  async save() {}

  async delete(key: string) {
    const map = stores.get(this.#path);
    if (!map) {
      return;
    }
    map.delete(key);
  }

  async clear() {
    stores.delete(this.#path);
  }

  async close() {}
}

export const resetInMemoryTauriStore = () => {
  for (const map of stores.values()) {
    map.clear();
  }
};
