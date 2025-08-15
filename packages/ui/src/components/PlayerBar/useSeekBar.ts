import { MouseEvent, useCallback, useMemo, useRef } from 'react';

type UseSeekBarParams = {
  progress: number;
  isLoading?: boolean;
  onSeek?: (percent: number) => void;
};

export const useSeekBar = ({
  progress,
  isLoading = false,
  onSeek,
}: UseSeekBarParams) => {
  const clamped = useMemo(
    () => Math.max(0, Math.min(100, progress)),
    [progress],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteractive = Boolean(onSeek) && !isLoading;

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!isInteractive) return;
      const target = containerRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = (x / rect.width) * 100;
      const clampedPercent = Math.max(0, Math.min(100, percent));
      onSeek?.(clampedPercent);
    },
    [isInteractive, onSeek],
  );

  return { clamped, containerRef, handleClick, isInteractive } as const;
};

export type UseSeekBarReturn = ReturnType<typeof useSeekBar>;
