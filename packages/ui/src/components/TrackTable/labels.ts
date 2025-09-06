import { TrackTableLabels } from './types';

export const defaultTrackTableLabels: TrackTableLabels = {
  playNow: 'Play now',
  addToQueue: 'Add to queue',
  playNext: 'Play next',
  favorite: 'Add to favorites',
  unfavorite: 'Remove from favorites',
  contextMenu: 'More actions',
  selectAll: 'Select all tracks',
  reorderUnavailableDueToSort: 'Reordering disabled while sorted',
  reorderUnavailableDueToFilter: 'Reordering disabled while filtering',
  keyboardInstructions: 'Use arrow keys to navigate and space to select',
  dragHandleLabel: 'Drag to reorder',
};

export function mergeLabels(
  partial?: Partial<TrackTableLabels>,
): TrackTableLabels {
  if (!partial) {
    return defaultTrackTableLabels;
  }
  return { ...defaultTrackTableLabels, ...partial };
}
