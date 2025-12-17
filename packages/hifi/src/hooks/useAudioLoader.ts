import { RefObject, useEffect, useRef } from 'react';

import { AudioSource } from '../types';

export const useAudioLoader = (
  audioRef: RefObject<HTMLAudioElement | null>,
  src: AudioSource,
  isReady: boolean,
) => {
  const prevSrc = useRef<AudioSource | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (src !== prevSrc.current) {
      audio.load();
      prevSrc.current = src;
    }
  }, [src, isReady, audioRef]);
};
