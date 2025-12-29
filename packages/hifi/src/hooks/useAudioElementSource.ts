import { RefObject, useEffect, useState } from 'react';

export const useAudioElementSource = (
  audioRef: RefObject<HTMLAudioElement | null>,
  context: AudioContext | null,
) => {
  const [source, setSource] = useState<MediaElementAudioSourceNode | null>(
    null,
  );
  const [gain, setGain] = useState<GainNode | null>(null);

  useEffect(() => {
    if (!context || !audioRef.current) {
      return;
    }

    const audioSource = context.createMediaElementSource(audioRef.current);
    const gainNode = context.createGain();

    audioSource.connect(gainNode).connect(context.destination);

    setSource(audioSource);
    setGain(gainNode);

    return () => {
      audioSource.disconnect();
      gainNode.disconnect();
    };
  }, [context, audioRef]);

  return { source, gain };
};
