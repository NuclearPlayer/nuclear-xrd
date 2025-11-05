import pick from 'lodash-es/pick';

import type { Queue } from '@nuclearplayer/model';

import { useQueueStore } from '../stores/queue/queue.store';

export const useQueue = (): Queue => {
  return useQueueStore((state) =>
    pick(state, ['items', 'currentIndex', 'repeatMode', 'shuffleEnabled']),
  );
};
