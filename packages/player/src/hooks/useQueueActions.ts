import pick from 'lodash-es/pick';

import { useQueueStore } from '../stores/queue/queue.store';

export const useQueueActions = () => {
  return useQueueStore((state) =>
    pick(state, [
      'addToQueue',
      'addNext',
      'addAt',
      'removeByIds',
      'removeByIndices',
      'clearQueue',
      'reorder',
      'updateItemState',
      'goToNext',
      'goToPrevious',
      'goToIndex',
      'goToId',
      'setRepeatMode',
      'setShuffleEnabled',
    ]),
  );
};
