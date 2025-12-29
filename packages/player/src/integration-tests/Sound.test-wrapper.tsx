import { render, RenderResult } from '@testing-library/react';

import App from '../App';
import { useSoundStore } from '../stores/soundStore';

export const SoundWrapper = {
  async mount(): Promise<RenderResult> {
    return render(<App />);
  },
  setSrc(src: string) {
    useSoundStore.getState().setSrc(src);
  },
  play() {
    useSoundStore.getState().play();
  },
  pause() {
    useSoundStore.getState().pause();
  },
  stop() {
    useSoundStore.getState().stop();
  },
  seekTo(seconds: number) {
    useSoundStore.getState().seekTo(seconds);
  },
  setCrossfadeMs(ms: number) {
    useSoundStore.getState().setCrossfadeMs(ms);
  },
  getAudios(): NodeListOf<HTMLAudioElement> {
    return document.querySelectorAll('audio');
  },
  getActiveAudio(): HTMLAudioElement | null {
    return document.querySelector('audio[data-is-active="true"]');
  },
};
