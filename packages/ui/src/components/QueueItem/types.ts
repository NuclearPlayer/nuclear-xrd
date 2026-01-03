import { type VariantProps } from 'class-variance-authority';

import type { Track } from '@nuclearplayer/model';

import { QueuePanelProps } from '../QueuePanel/QueuePanel';
import { queueItemVariants } from './variants';

export type QueueItemProps = VariantProps<typeof queueItemVariants> & {
  track: Track;
  onSelect?: () => void;
  onRemove?: () => void;
  errorMessage?: string;
  labels: Pick<QueuePanelProps['labels'], 'removeButton' | 'playbackError'>;
  classes?: {
    root?: string;
    thumbnail?: string;
    content?: string;
    title?: string;
    artist?: string;
    duration?: string;
    error?: string;
    removeButton?: string;
  };
};
