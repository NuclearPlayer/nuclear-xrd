import { useSyncExternalStore } from 'react';

import {
  listZustandStores,
  subscribeToZustandRegistry,
} from '../../devtools/zustandRegistry';

const useZustandStoreRegistrations = () => {
  return useSyncExternalStore(subscribeToZustandRegistry, listZustandStores);
};

export const ZustandDevtoolsPanel = () => {
  const stores = useZustandStoreRegistrations();

  if (stores.length === 0) {
    return <div className="p-3 text-sm">No Zustand stores registered.</div>;
  }

  const store = stores[0];
  const state = useSyncExternalStore(store.subscribe, store.getState);

  return (
    <div className="h-full p-3 text-sm">
      <div className="mb-2 font-medium">{store.name}</div>
      <pre className="h-full w-full overflow-auto rounded bg-black/20 p-2 whitespace-pre-wrap">
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};
