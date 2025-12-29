export type ZustandStoreRegistration = {
  name: string;
  getState: () => unknown;
  subscribe: (listener: () => void) => () => void;
};

const isDev = import.meta.env.DEV;

const storeByName = new Map<string, ZustandStoreRegistration>();
const registryListeners = new Set<() => void>();

let storesSnapshot: ZustandStoreRegistration[] = [];

const notifyRegistryListeners = (): void => {
  registryListeners.forEach((listener) => {
    listener();
  });
};

export const registerZustandStore = (
  registration: ZustandStoreRegistration,
): void => {
  if (!isDev) {
    return;
  }

  storeByName.set(registration.name, registration);

  storesSnapshot = Array.from(storeByName.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  notifyRegistryListeners();
};

export const listZustandStores = (): ZustandStoreRegistration[] => {
  if (!isDev) {
    return [];
  }

  return storesSnapshot;
};

export const subscribeToZustandRegistry = (
  listener: () => void,
): (() => void) => {
  if (!isDev) {
    return () => {};
  }

  registryListeners.add(listener);
  return () => {
    registryListeners.delete(listener);
  };
};
