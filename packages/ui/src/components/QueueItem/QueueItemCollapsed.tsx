import { Music } from 'lucide-react';
import { FC } from 'react';

import { pickArtwork } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { Box } from '../Box';
import type { QueueItemProps } from './types';
import { queueItemVariants } from './variants';

export const QueueItemCollapsed: FC<QueueItemProps> = ({
  track,
  status = 'idle',
  isCurrent = false,
  onSelect,
  classes,
}) => {
  const thumbnail = pickArtwork(track.artwork, 'thumbnail', 64);

  return (
    <div className="relative">
      <div
        className={cn(
          'pointer-events-none absolute -top-0.75 -left-0.75 h-17.5 w-17.5 rounded-md transition-all',
          isCurrent && 'bg-primary',
          status === 'error' && 'bg-accent-red',
        )}
      />
      <Box
        variant="tertiary"
        shadow="none"
        className={cn(
          queueItemVariants({ status, isCurrent, isCollapsed: true }),
          classes?.root,
        )}
        onClick={onSelect}
        role={onSelect ? 'button' : undefined}
      >
        {thumbnail?.url ? (
          <img
            src={thumbnail.url}
            alt={track.title}
            className={cn('h-full w-full object-cover', classes?.thumbnail)}
          />
        ) : (
          <Music size={24} className="text-foreground-secondary" />
        )}

        {status === 'loading' && (
          <div className="bg-stripes-diagonal absolute inset-x-0 bottom-0 h-1" />
        )}
      </Box>
    </div>
  );
};
