import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
} from 'react';

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
  const prevSrc = useRef<AudioSource | null>(null);

  usePlaybackStatus(audioRef, status, context, isReady);

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
  }, [src, isReady]);

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
  }, [seek, isReady]);

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
