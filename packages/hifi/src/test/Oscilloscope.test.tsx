import { render } from '@testing-library/react';

import { Oscilloscope } from '../Oscilloscope';

describe('Oscilloscope', () => {
  it('calls onData with expected number of points', () => {
    const analyser = (() => {
      let _fftSize = 0;
      const analyserNode: AnalyserNode = {
        frequencyBinCount: 0,
        fftSize: 0,
        connect: () => undefined,
        disconnect: () => undefined,
        getByteTimeDomainData: (arr: Uint8Array) => {
          for (let i = 0; i < arr.length; i++) arr[i] = 128;
        },
      } as unknown as AnalyserNode & {
        frequencyBinCount: number;
        fftSize: number;
      };

      Object.defineProperty(analyserNode, 'fftSize', {
        get: () => _fftSize,
        set: (v: number) => {
          _fftSize = v;
          (analyserNode as { frequencyBinCount: number }).frequencyBinCount =
            v / 2;
        },
      });
      return analyserNode as AnalyserNode;
    })();

    const ctx = {
      createAnalyser: () => analyser,
    } as AudioContext;

    const prev = {
      connect: () => undefined,
      disconnect: () => undefined,
    } as unknown as AudioNode;

    const onData = vi.fn();

    render(
      <Oscilloscope
        audioContext={ctx}
        previousNode={prev}
        width={100}
        height={50}
        onData={onData}
      />,
    );

    expect(onData.mock.calls).toMatchSnapshot();
  });
});
