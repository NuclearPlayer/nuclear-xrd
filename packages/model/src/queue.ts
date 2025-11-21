import type { Track } from './index';

export type QueueItem = {
  id: string;
  track: Track;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  activeStreamIndex: number;
  failedStreamIndices: number[];
  addedAtIso: string;
};

export type RepeatMode = 'off' | 'all' | 'one';

export type Queue = {
  items: QueueItem[];
  currentIndex: number;
  repeatMode: RepeatMode;
  shuffleEnabled: boolean;
};
