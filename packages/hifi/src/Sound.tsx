import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAudioGraph } from './useAudioGraph';

type AudioSource = string | Array<{ src: string; type?: string }>;

export type SoundStatus = 'playing' | 'paused' | 'stopped';

export type SoundProps = {
  src: AudioSource;
  status: SoundStatus;
  seek?: number;
  crossfadeMs?: number;
  preload?: 'none' | 'metadata' | 'auto';
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  onTimeUpdate?: (args: { position: number; duration: number }) => void;
  onEnd?: () => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: (error: Error) => void;
  children?: ReactNode;
};

const DEFAULT_CROSSFADE_MS = 0;

export const Sound: React.FC<SoundProps> = ({
  src,
  status,
  seek,
  crossfadeMs = DEFAULT_CROSSFADE_MS,
  preload = 'auto',
  crossOrigin = '',
  onTimeUpdate,
  onEnd,
  onLoadStart,
  onCanPlay,
  onError,
  children,
}) => {
  const audioRefA = useRef<HTMLAudioElement | null>(null);
  const audioRefB = useRef<HTMLAudioElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { context, sourceA, sourceB, gainA, gainB, isReady } = useAudioGraph(
    audioRefA,
    audioRefB,
  );
  const prevSrc = useRef<AudioSource>(src);

  const adapters = useMemo(
    () =>
      [
        {
          id: 0,
          ref: audioRefA,
          source: sourceA,
          gain: gainA,
        },
        {
          id: 1,
          ref: audioRefB,
          source: sourceB,
          gain: gainB,
        },
      ] as const,
    [sourceA, sourceB, gainA, gainB],
  );

  const current = adapters[activeIndex];
  const next = adapters[1 - activeIndex];

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const audio = current.ref.current;
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
  }, [status, isReady, activeIndex, context]);

  useEffect(() => {
    if (!isReady || seek == null) {
      return;
    }
    const audio = current.ref.current;
    if (audio) {
      audio.currentTime = seek;
    }
  }, [seek, isReady, activeIndex]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (src === prevSrc.current) {
      return;
    }
    const nextIndex = 1 - activeIndex;
    if (crossfadeMs === 0) {
      setActiveIndex(nextIndex);
      prevSrc.current = src;
      return;
    }
    const currentGain = current.gain;
    const nextGain = next.gain;
    const currentAudio = current.ref.current;
    const nextAudio = next.ref.current;
    if (!currentGain || !nextGain || !nextAudio || !context) {
      return;
    }
    nextGain.gain.setValueAtTime(0, context.currentTime);
    nextAudio.load();
    nextAudio.play();
    nextGain.gain.linearRampToValueAtTime(
      1,
      context.currentTime + crossfadeMs / 1000,
    );
    currentGain.gain.linearRampToValueAtTime(
      0,
      context.currentTime + crossfadeMs / 1000,
    );
    setTimeout(() => {
      setActiveIndex(nextIndex);
      if (currentAudio) {
        currentAudio.pause();
      }
      prevSrc.current = src;
    }, crossfadeMs);
  }, [
    src,
    crossfadeMs,
    isReady,
    activeIndex,
    current.gain,
    next.gain,
    context,
  ]);

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
      {[adapters[0], adapters[1]].map((adapter) => (
        <audio
          key={adapter.id}
          ref={adapter.ref}
          hidden
          preload={preload}
          crossOrigin={crossOrigin}
          data-is-active={activeIndex === adapter.id}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnd}
          onLoadStart={onLoadStart}
          onCanPlay={onCanPlay}
          onError={handleError}
        >
          {renderSources(activeIndex === adapter.id ? prevSrc.current : src)}
        </audio>
      ))}
      {isReady &&
        context &&
        children &&
        Children.map(children, (child, idx) =>
          isValidElement(child)
            ? cloneElement(
                child as React.ReactElement<Record<string, unknown>>,
                {
                  audioContext: context,
                  previousNode:
                    idx === 0 ? (current.source ?? undefined) : undefined,
                },
              )
            : child,
        )}
    </>
  );
};
