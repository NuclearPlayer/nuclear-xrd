import { RefObject, useEffect, useState } from 'react';

export const useAudioGraph = (
  refA: RefObject<HTMLAudioElement>,
  refB: RefObject<HTMLAudioElement>,
) => {
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
    if (!context) return;
    const audioA = refA.current;
    const audioB = refB.current;
    if (!audioA || !audioB) return;

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

  return { context, sourceA, sourceB, gainA, gainB, isReady };
};
