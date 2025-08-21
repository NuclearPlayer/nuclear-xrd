import { render } from '@testing-library/react';
import { cloneElement } from 'react';

import { Equalizer } from '../plugins/Equalizer';

describe('Equalizer', () => {
  it('updates band gains based on data and preAmp', () => {
    const created: Array<{
      frequency: { value: number };
      gain: { value: number };
      Q: { value: number };
      type: BiquadFilterType;
      connect: (n: unknown) => void;
      disconnect: () => void;
    }> = [];
    const ctx = {
      createBiquadFilter: () => {
        const node = {
          frequency: { value: 0 },
          gain: { value: 0 },
          Q: { value: 0 },
          type: 'peaking' as BiquadFilterType,
          connect: () => undefined,
          disconnect: () => undefined,
        };
        created.push(node);
        return node as unknown as BiquadFilterNode;
      },
    } as unknown as AudioContext;

    const prev = { connect: () => undefined } as unknown as AudioNode;

    let WrappedEqualizer = cloneElement(
      <Equalizer data={{ 60: 3, 10000: -1 }} />,
      {
        audioContext: ctx,
        previousNode: prev,
      },
    );
    const { rerender } = render(WrappedEqualizer);

    expect(created.length).toBe(2);
    const last = created[created.length - 1];
    expect(last.frequency.value).toBe(10000);
    expect(last.gain.value).toBe(-1);

    WrappedEqualizer = cloneElement(
      <Equalizer data={{ 60: 3, 10000: -3 }} preAmp={0} />,
      {
        audioContext: ctx,
        previousNode: prev,
      },
    );

    rerender(WrappedEqualizer);

    expect(last.gain.value).toBe(-3);
  });
});
