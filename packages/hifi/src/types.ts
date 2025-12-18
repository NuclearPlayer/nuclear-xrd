import { ReactNode, ScriptHTMLAttributes } from 'react';

export type AudioSource = string;
export type SoundStatus = 'playing' | 'paused' | 'stopped';
export type SoundProps = {
  src: AudioSource;
  status: SoundStatus;
  seek?: number;
  preload?: HTMLAudioElement['preload'];
  crossOrigin?: ScriptHTMLAttributes<HTMLAudioElement>['crossOrigin'];
  onTimeUpdate?: (args: { position: number; duration: number }) => void;
  onEnd?: () => void;
  onLoadStart?: () => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
};
