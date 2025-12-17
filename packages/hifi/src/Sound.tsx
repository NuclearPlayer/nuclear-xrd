import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useRef,
} from 'react';

import { useAudioLoader } from './hooks/useAudioLoader';
import { useAudioSeek } from './hooks/useAudioSeek';
import { usePlaybackStatus } from './hooks/usePlaybackStatus';
import { AudioSource, SoundProps } from './types';
import { useAudioGraph } from './useAudioGraph';

export const Sound: React.FC<SoundProps> = ({
  src,
  status,
  seek,
  preload = 'auto',
  crossOrigin = '',
  onTimeUpdate,
  onEnd,
  onLoadStart,
  onCanPlay,
  onError,
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dummyRef = useRef<HTMLAudioElement | null>(null);
  const { context, sourceA, isReady } = useAudioGraph(audioRef, dummyRef);

  usePlaybackStatus(audioRef, status, context, isReady);
  useAudioSeek(audioRef, seek, isReady);
  useAudioLoader(audioRef, src, isReady);

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

  const renderSources = (src: AudioSource) => {
    if (typeof src === 'string') {
      return <source src={src} />;
    }
    return src.map((s, i) => <source key={i} src={s.src} type={s.type} />);
  };

  return (
    <>
      <audio
        ref={audioRef}
        hidden
        preload={preload}
        crossOrigin={crossOrigin}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnd}
        onLoadStart={onLoadStart}
        onCanPlay={onCanPlay}
        onError={handleError}
      >
        {renderSources(src)}
      </audio>
      {isReady &&
        context &&
        children &&
        Children.map(children, (child, idx) =>
          isValidElement(child)
            ? cloneElement(
                child as React.ReactElement<Record<string, unknown>>,
                {
                  audioContext: context,
                  previousNode: idx === 0 ? (sourceA ?? undefined) : undefined,
                },
              )
            : child,
        )}
    </>
  );
};
