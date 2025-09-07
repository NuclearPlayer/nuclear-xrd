import { FC } from 'react';

import '../../styles.css';

import { cn } from '../../utils';
import { formatTimeSeconds } from '../../utils/time';
import { useSeekBar } from './useSeekBar';

export type PlayerSeekBarProps = {
  progress: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  isLoading?: boolean;
  onSeek?: (percent: number) => void;
  className?: string;
};

export const PlayerBarSeekBar: FC<PlayerSeekBarProps> = ({
  progress,
  elapsedSeconds,
  remainingSeconds,
  isLoading = false,
  onSeek,
  className = '',
}) => {
  const { clamped, containerRef, handleClick, isInteractive } = useSeekBar({
    progress,
    isLoading,
    onSeek,
  });

  return (
    <div className={cn('w-full px-4 select-none', className)}>
      <div className="mb-1 flex items-center justify-between text-xs leading-none">
        <span className="text-foreground-secondary tabular-nums">
          {formatTimeSeconds(elapsedSeconds)}
        </span>
        <span className="text-foreground-secondary tabular-nums">
          {formatTimeSeconds(-Math.abs(remainingSeconds))}
        </span>
      </div>
      <div
        ref={containerRef}
        className={cn('relative h-2 w-full', {
          'pointer-events-none cursor-not-allowed': isLoading,
          'cursor-pointer': isInteractive,
        })}
        onClick={handleClick}
        aria-disabled={isLoading}
      >
        <div
          className={cn(
            'border-border bg-background-secondary shadow-shadow absolute inset-0 border',
            { 'overflow-hidden': isLoading },
          )}
        >
          {isLoading && (
            <div className="bg-stripes-diagonal absolute inset-0 opacity-80" />
          )}
          {!isLoading && (
            <div
              className={cn('bg-primary h-full', 'transition-none')}
              style={{ width: `${clamped}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
