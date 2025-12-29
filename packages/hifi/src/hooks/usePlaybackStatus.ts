import { RefObject, useEffect } from 'react';

import { SoundStatus } from '../types';

export const usePlaybackStatus = (
  audioRef: RefObject<HTMLAudioElement | null>,
  status: SoundStatus,
  context: AudioContext | null,
  isReady: boolean,
) => {
  useEffect(() => {
    if (!isReady) {
      return;
    }
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    switch (status) {
      case 'playing': {
        context?.resume();
        audio.play();
        break;
      }
      case 'paused': {
        audio.pause();
        break;
      }
      case 'stopped': {
        audio.pause();
        audio.currentTime = 0;
        break;
      }
    }
  }, [status, isReady, context, audioRef]);
};
