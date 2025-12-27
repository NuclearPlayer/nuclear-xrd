import { useCallback } from 'react';

type AudioEventsProps = {
  onTimeUpdate?: (args: { position: number; duration: number }) => void;
  onError?: (error: Error) => void;
};

export const useAudioEvents = ({ onTimeUpdate, onError }: AudioEventsProps) => {
  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement>) => {
      if (onTimeUpdate) {
        const el = e.currentTarget;
        onTimeUpdate({ position: el.currentTime, duration: el.duration });
      }
    },
    [onTimeUpdate],
  );

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement>) => {
      if (onError) {
        const el = e.currentTarget as HTMLAudioElement & {
          error: MediaError | null;
        };
        onError(new Error(el.error?.message || 'Unknown audio error'));
      }
    },
    [onError],
  );

  return {
    handleTimeUpdate,
    handleError,
  };
};
