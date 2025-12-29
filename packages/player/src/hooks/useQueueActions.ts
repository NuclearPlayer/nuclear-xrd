import { useQueueStore } from '../stores/queueStore';

// You can't replace this with lodash pick because it causes infinite re-renders
export const useQueueActions = () => {
  const {
    addToQueue,
    addNext,
    addAt,
    removeByIds,
    removeByIndices,
    clearQueue,
    reorder,
    updateItemState,
    goToNext,
    goToPrevious,
    goToIndex,
    goToId,
    setRepeatMode,
    setShuffleEnabled,
  } = useQueueStore();

  return {
    addToQueue,
    addNext,
    addAt,
    removeByIds,
    removeByIndices,
    clearQueue,
    reorder,
    updateItemState,
    goToNext,
    goToPrevious,
    goToIndex,
    goToId,
    setRepeatMode,
    setShuffleEnabled,
  };
};
