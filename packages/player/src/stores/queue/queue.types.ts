import type { QueueItem } from '@nuclearplayer/model';

export type RepeatMode = 'off' | 'all' | 'one';

export type Queue = {
  items: QueueItem[];
  currentIndex: number;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
};
