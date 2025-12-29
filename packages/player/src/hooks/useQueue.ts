import { useMemo } from 'react';

import type { Queue } from '@nuclearplayer/model';

import { useQueueStore } from '../stores/queueStore';

// You can't replace this with lodash pick because it causes infinite re-renders
export const useQueue = (): Queue => {
  const { items, currentIndex, repeatMode, shuffleEnabled } = useQueueStore();

  return useMemo(
    () => ({ items, currentIndex, repeatMode, shuffleEnabled }),
    [items, currentIndex, repeatMode, shuffleEnabled],
  );
};
