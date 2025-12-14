import { useEffect, useRef } from 'react';

type UseSeekControlParams = {
  seek: number | undefined;
  currentAudioRef: React.RefObject<HTMLAudioElement | null>;
  isReady: boolean;
};

const SEEK_THRESHOLD = 0.5;

export const useSeekControl = ({
  seek,
  currentAudioRef,
  isReady,
}: UseSeekControlParams): void => {
  const lastSeekRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const audio = currentAudioRef.current;
    if (!audio || seek == null) {
      return;
    }

    const currentTime = audio.currentTime;
    const seekDelta = Math.abs(seek - currentTime);
    const isSignificantChange = seekDelta > SEEK_THRESHOLD;

    if (isSignificantChange) {
      audio.currentTime = seek;
    }

    lastSeekRef.current = seek;
  }, [seek, isReady, currentAudioRef]);
};
