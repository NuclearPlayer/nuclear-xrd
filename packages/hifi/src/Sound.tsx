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
  const audioRefA = useRef<HTMLAudioElement>(null);
  const audioRefB = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState<'A' | 'B'>('A');
  const [context, setContext] = useState<AudioContext | null>(null);
  const [sourceA, setSourceA] = useState<MediaElementAudioSourceNode | null>(
    null,
  );
  const [sourceB, setSourceB] = useState<MediaElementAudioSourceNode | null>(
    null,
  );
  const [gainA, setGainA] = useState<GainNode | null>(null);
  const [gainB, setGainB] = useState<GainNode | null>(null);
  const [isReady, setIsReady] = useState(false);
  const prevSrc = useRef<AudioSource>(src);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!context) setContext(new window.AudioContext());
    return () => {
      context?.close();
    };
  }, []);

  useEffect(() => {
    if (!context) return;
    if (!audioRefA.current || !audioRefB.current) return;
    const srcA = context.createMediaElementSource(audioRefA.current);
    const srcB = context.createMediaElementSource(audioRefB.current);
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
    if (!isReady) return;
    const audio = active === 'A' ? audioRefA.current : audioRefB.current;
    if (!audio) return;
    switch (status) {
      case 'playing':
        context?.resume();
        audio.play();
        break;
      case 'paused':
        audio.pause();
        break;
      case 'stopped':
        audio.pause();
        audio.currentTime = 0;
        break;
    }
  }, [status, isReady, active, context]);

  useEffect(() => {
    if (!isReady || seek == null) return;
    const audio = active === 'A' ? audioRefA.current : audioRefB.current;
    if (audio) audio.currentTime = seek;
  }, [seek, isReady, active]);
  useEffect(() => {
    if (!isReady || seek == null) return;
    const audio = active === 'A' ? audioRefA.current : audioRefB.current;
    if (audio) audio.currentTime = seek;
  }, [seek, isReady, active]);

  useEffect(() => {
    if (!isReady) return;
    if (src === prevSrc.current) return;
    if (crossfadeMs === 0) {
      setActive(active === 'A' ? 'B' : 'A');
      prevSrc.current = src;
      return;
    }
    const fadeOut = active === 'A' ? gainA : gainB;
    const fadeIn = active === 'A' ? gainB : gainA;
    const nextAudio = active === 'A' ? audioRefB.current : audioRefA.current;
    if (!fadeOut || !fadeIn || !nextAudio) return;
    fadeIn.gain.setValueAtTime(0, context!.currentTime);
    nextAudio.load();
    nextAudio.play();
    fadeIn.gain.linearRampToValueAtTime(
      1,
      context!.currentTime + crossfadeMs / 1000,
    );
    fadeOut.gain.linearRampToValueAtTime(
      0,
      context!.currentTime + crossfadeMs / 1000,
    );
    setTimeout(() => {
      setActive(active === 'A' ? 'B' : 'A');
      prevSrc.current = src;
    }, crossfadeMs);
  }, [src, crossfadeMs, isReady, active, gainA, gainB, context]);
  useEffect(() => {
    if (!isReady) return;
    if (src === prevSrc.current) return;
    if (crossfadeMs === 0) {
      setActive(active === 'A' ? 'B' : 'A');
      prevSrc.current = src;
      return;
    }
    // Crossfade logic
    const fadeOut = active === 'A' ? gainA : gainB;
    const fadeIn = active === 'A' ? gainB : gainA;
    const nextAudio = active === 'A' ? audioRefB.current : audioRefA.current;
    if (!fadeOut || !fadeIn || !nextAudio) return;
    fadeIn.gain.setValueAtTime(0, context!.currentTime);
    nextAudio.load();
    nextAudio.play();
    fadeIn.gain.linearRampToValueAtTime(
      1,
      context!.currentTime + crossfadeMs / 1000,
    );
    fadeOut.gain.linearRampToValueAtTime(
      0,
      context!.currentTime + crossfadeMs / 1000,
    );
    setTimeout(() => {
      setActive(active === 'A' ? 'B' : 'A');
      prevSrc.current = src;
    }, crossfadeMs);
  }, [src, crossfadeMs, isReady, active, gainA, gainB, context]);

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
        const err = (e.currentTarget as any).error;
        onError(new Error(err?.message || 'Unknown audio error'));
      }
    },
    [onError],
  );
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
        const err = (e.currentTarget as any).error;
        onError(new Error(err?.message || 'Unknown audio error'));
      }
    },
    [onError],
  );

  const renderSources = (src: AudioSource) => {
    if (typeof src === 'string') return <source src={src} />;
    return src.map((s, i) => <source key={i} src={s.src} type={s.type} />);
  };
  const renderSources = (src: AudioSource) => {
    if (typeof src === 'string') return <source src={src} />;
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
        {renderSources(active === 'A' ? src : prevSrc.current)}
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
        {renderSources(active === 'B' ? src : prevSrc.current)}
      </audio>
      {isReady &&
        context &&
        children &&
        React.Children.map(children, (child, idx) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
                audioContext: context,
                previousNode:
                  idx === 0 ? (active === 'A' ? sourceA : sourceB) : undefined,
              })
            : child,
        )}
    </>
  );
};
