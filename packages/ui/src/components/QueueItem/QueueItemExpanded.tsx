import { AlertCircle, Music, X } from 'lucide-react';
import { FC } from 'react';

import { pickArtwork } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { formatTimeMillis } from '../../utils/time';
import { Box } from '../Box';
import { Button } from '../Button';
import type { QueueItemProps } from './types';
import { queueItemVariants } from './variants';

export const QueueItemExpanded: FC<QueueItemProps> = ({
  track,
  status = 'idle',
  isCurrent = false,
  onSelect,
  onRemove,
  errorMessage,
  labels,
  classes,
}) => {
  const thumbnail = pickArtwork(track.artwork, 'thumbnail', 64);
  const duration = formatTimeMillis(track.durationMs);
  const primaryArtist = track.artists[0]?.name || 'Unknown Artist';

  return (
    <Box
      variant="tertiary"
      shadow="none"
      className={cn(
        queueItemVariants({ status, isCurrent, isCollapsed: false }),
        classes?.root,
      )}
      onClick={onSelect}
      role={onSelect ? 'button' : undefined}
    >
      <div
        className={cn(
          'border-border bg-background flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm border-2',
          classes?.thumbnail,
        )}
      >
        {thumbnail?.url ? (
          <img
            src={thumbnail.url}
            alt={track.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Music size={32} className="text-foreground-secondary" />
        )}
      </div>

      <div className={cn('min-w-0 flex-1', classes?.content)}>
        <div
          className={cn(
            'text-foreground truncate text-sm font-bold',
            classes?.title,
          )}
        >
          {track.title}
        </div>
        <div
          className={cn(
            'text-foreground-secondary truncate text-xs',
            classes?.artist,
          )}
        >
          {primaryArtist}
        </div>
        {status === 'error' && errorMessage && (
          <div
            className={cn(
              'text-accent-red mt-1 flex items-center gap-1 text-xs font-semibold',
              classes?.error,
            )}
          >
            <AlertCircle size={12} />
            <span className="truncate">
              {labels?.errorPrefix && `${labels.errorPrefix}: `}
              {errorMessage}
            </span>
          </div>
        )}
      </div>

      <div className="relative flex flex-shrink-0 items-center">
        {duration && (
          <div
            className={cn(
              'text-foreground-secondary text-sm tabular-nums',
              classes?.duration,
            )}
          >
            {duration}
          </div>
        )}

        {onRemove && (
          <Button
            size="icon-sm"
            variant="noShadow"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={labels?.removeButton || 'Remove'}
            className={cn(
              'absolute right-0 opacity-0 transition-opacity group-hover:opacity-100',
              classes?.removeButton,
            )}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {status === 'loading' && (
        <div className="bg-stripes-diagonal absolute inset-x-0 bottom-0 h-1" />
      )}
    </Box>
  );
};
