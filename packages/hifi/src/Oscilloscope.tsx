import React, { useEffect, useRef } from 'react';

export type OscilloscopeProps = {
  audioContext: AudioContext;
  previousNode: AudioNode;
  width: number;
  height: number;
  onData: (data: Array<[number, number]>) => void;
};

export const Oscilloscope: React.FC<OscilloscopeProps> = ({
  audioContext,
  previousNode,
  width,
  height,
  onData,
}) => {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!audioContext) {
      return;
    }
    if (!previousNode) {
      return;
    }
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    previousNode.connect(analyser);
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    return () => {
      previousNode.disconnect(analyser);
      analyser.disconnect();
      analyserRef.current = null;
      dataArrayRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioContext, previousNode]);

  useEffect(() => {
    function draw() {
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;
      if (!analyser || !dataArray) {
        return;
      }
      if (analyser.frequencyBinCount === 0) {
        return;
      }
      analyser.getByteTimeDomainData(dataArray as Uint8Array<ArrayBuffer>);
      const sliceWidth = width / analyser.frequencyBinCount;
      let x = 0;
      const data: Array<[number, number]> = [];
      for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        data.push([x, y]);
        x += sliceWidth;
      }
      onData(data);
      animationFrameRef.current = requestAnimationFrame(draw);
    }
    if (
      analyserRef.current &&
      dataArrayRef.current &&
      analyserRef.current.frequencyBinCount > 0
    ) {
      draw();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [width, height, onData]);

  return null;
};
