import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

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
  const [context, setContext] = useState<AudioContext | null>(null);
  const [sourceA, setSourceA] = useState<MediaElementAudioSourceNode | null>(
    null,
  );
  const [sourceB, setSourceB] = useState<MediaElementAudioSourceNode | null>(
    null,
  );
  const [gainA, setGainA] = useState<GainNode | null>(null);
  const [gainB, setGainB] = useState<GainNode | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const prevSrc = useRef<AudioSource>(src);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (context === null) {
      setContext(new window.AudioContext());
    }
    return () => {
      context?.close();
    };
  }, [context]);

  useEffect(() => {
    if (!context) {
      return;
    }
    const audioA = audioRefA.current;
    const audioB = audioRefB.current;
    if (!audioA || !audioB) {
      return;
    }
    const srcA = context.createMediaElementSource(audioA);
    const srcB = context.createMediaElementSource(audioB);
    const gainNodeA = context.createGain();
    const gainNodeB = context.createGain();
    srcA.connect(gainNodeA).connect(context.destination);
    srcB.connect(gainNodeB).connect(context.destination);
    setSourceA(srcA);
    setSourceB(srcB);
    setGainA(gainNodeA);
    setGainB(gainNodeB);
    setIsReady(true);
    return () => {
      srcA.disconnect();
      srcB.disconnect();
      gainNodeA.disconnect();
      gainNodeB.disconnect();
    };
  }, [context]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    const audio = activeIndex === 0 ? audioRefA.current : audioRefB.current;
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
    const audio = activeIndex === 0 ? audioRefA.current : audioRefB.current;
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
    const currentGain = activeIndex === 0 ? gainA : gainB;
    const nextGain = nextIndex === 0 ? gainA : gainB;
    const nextAudio = nextIndex === 0 ? audioRefA.current : audioRefB.current;
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
      prevSrc.current = src;
    }, crossfadeMs);
  }, [src, crossfadeMs, isReady, activeIndex, gainA, gainB, context]);

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
        ref={audioRefA}
        hidden
        preload={preload}
        crossOrigin={crossOrigin}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnd}
        onLoadStart={onLoadStart}
        onCanPlay={onCanPlay}
        onError={handleError}
      >
        {renderSources(activeIndex === 0 ? prevSrc.current : src)}
      </audio>
      <audio
        ref={audioRefB}
        hidden
        preload={preload}
        crossOrigin={crossOrigin}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnd}
        onLoadStart={onLoadStart}
        onCanPlay={onCanPlay}
        onError={handleError}
      >
        {renderSources(activeIndex === 1 ? prevSrc.current : src)}
      </audio>
      {isReady &&
        context &&
        children &&
        React.Children.map(children, (child, idx) =>
          React.isValidElement(child)
            ? React.cloneElement(
                child as React.ReactElement<Record<string, unknown>>,
                {
                  audioContext: context,
                  previousNode:
                    idx === 0
                      ? activeIndex === 0
                        ? sourceA
                        : sourceB
                      : undefined,
                },
              )
            : child,
        )}
    </>
  );
};
