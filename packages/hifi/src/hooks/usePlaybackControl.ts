import { useEffect } from 'react';

import type { SoundStatus } from '../Sound';

type UsePlaybackControlParams = {
  status: SoundStatus;
  currentAudioRef: React.RefObject<HTMLAudioElement | null>;
  nextAudioRef: React.RefObject<HTMLAudioElement | null>;
  audioContext: AudioContext | null;
  isReady: boolean;
};

export const usePlaybackControl = ({
  status,
  currentAudioRef,
  nextAudioRef,
  audioContext,
  isReady,
}: UsePlaybackControlParams): void => {
  useEffect(() => {
    const currentAudio = currentAudioRef.current;
    const nextAudio = nextAudioRef.current;
    if (!isReady) {
      return;
    }

    if (!currentAudio) {
      return;
    }

    if (status === 'stopped') {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      if (nextAudio) {
        nextAudio.pause();
        nextAudio.currentTime = 0;
      }
      return;
    }

    switch (status) {
      case 'playing': {
        audioContext?.resume();
        currentAudio.play();
        break;
      }
      case 'paused': {
        currentAudio.pause();
        if (nextAudio) {
          nextAudio.pause();
        }
        break;
      }
    }
  }, [status, isReady, currentAudioRef, nextAudioRef, audioContext]);
};
