import { create } from 'zustand';

export type AudioSource = string | Array<{ src: string; type?: string }>;

export type SoundStatus = 'playing' | 'paused' | 'stopped';

type SoundState = {
  src: AudioSource | null;
  status: SoundStatus;
  seek?: number;
  crossfadeMs: number;
  preload: 'none' | 'metadata' | 'auto';
  crossOrigin: '' | 'anonymous' | 'use-credentials';
};

type SoundActions = {
  setSrc: (src: AudioSource | null) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (seconds: number) => void;
  setCrossfadeMs: (ms: number) => void;
  setPreload: (mode: 'none' | 'metadata' | 'auto') => void;
  setCrossOrigin: (v: '' | 'anonymous' | 'use-credentials') => void;
};

export const useSoundStore = create<SoundState & SoundActions>((set) => ({
  src: null,
  status: 'stopped',
  crossfadeMs: 0,
  preload: 'auto',
  crossOrigin: '',
  setSrc: (src) => set({ src }),
  play: () => set({ status: 'playing' }),
  pause: () => set({ status: 'paused' }),
  stop: () => set({ status: 'stopped', seek: 0 }),
  seekTo: (seconds) => set({ seek: seconds }),
  setCrossfadeMs: (ms) => set({ crossfadeMs: ms }),
  setPreload: (mode) => set({ preload: mode }),
  setCrossOrigin: (v) => set({ crossOrigin: v }),
}));
