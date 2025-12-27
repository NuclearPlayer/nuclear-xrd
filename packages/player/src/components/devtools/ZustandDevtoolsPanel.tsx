import { useMemo, useState, useSyncExternalStore } from 'react';
import { ObjectInspector } from 'react-inspector';

import {
  listZustandStores,
  subscribeToZustandRegistry,
} from '../../devtools/zustandRegistry';

const useZustandStoreRegistrations = () => {
  return useSyncExternalStore(subscribeToZustandRegistry, listZustandStores);
};

export const ZustandDevtoolsPanel = () => {
  const stores = useZustandStoreRegistrations();

  const storeNames = useMemo(() => {
    return stores.map((store) => store.name);
  }, [stores]);

  const [selectedStoreName, setSelectedStoreName] = useState<string>(
    storeNames[0] ?? '',
  );

  const store =
    stores.find((candidate) => candidate.name === selectedStoreName) ??
    stores[0];
  const state = useSyncExternalStore(store.subscribe, store.getState);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/20 px-3 py-2 text-sm">
        <div className="font-medium tracking-wide">Zustand</div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-white/60">Store</div>
          <select
            className="h-8 rounded bg-black/20 px-2 text-sm outline-none"
            value={store.name}
            onChange={(event) => {
              setSelectedStoreName(event.target.value);
            }}
          >
            {stores.map((store) => (
              <option key={store.name} value={store.name}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 p-3">
        <div className="h-full w-full overflow-auto rounded border border-white/10 bg-black/10 p-2">
          <ObjectInspector data={state} expandLevel={2} theme="chromeDark" />
        </div>
      </div>
    </div>
  );
};
