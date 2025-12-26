import { useQueueStore } from '../stores/queueStore';
import { registerZustandStore } from './zustandRegistry';

export const registerZustandStores = (): void => {
  registerZustandStore({
    name: 'Queue',
    getState: useQueueStore.getState,
    subscribe: useQueueStore.subscribe,
  });
};
