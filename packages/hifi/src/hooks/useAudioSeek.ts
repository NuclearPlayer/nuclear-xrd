import { RefObject, useEffect, useRef } from 'react';

export const useAudioSeek = (
  audioRef: RefObject<HTMLAudioElement | null>,
  seek: number | undefined,
  isReady: boolean,
) => {
  const lastSeekRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const audio = audioRef.current;
    if (!audio || seek == null) {
      return;
    }

    const currentTime = audio.currentTime;
    const seekDelta = Math.abs(seek - currentTime);

    if (lastSeekRef.current !== seek && seekDelta > 0.5) {
      audio.currentTime = seek;
    }
    lastSeekRef.current = seek;
  }, [seek, isReady, audioRef]);
};
