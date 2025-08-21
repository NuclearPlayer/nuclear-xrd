import { render } from '@testing-library/react';

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

    const { rerender } = render(
      <Equalizer
        audioContext={ctx}
        previousNode={prev}
        data={{ 60: 3, 10000: 4 }}
        preAmp={1}
      />,
    );

    expect(created.length).toBe(2);
    const last = created[created.length - 1];
    expect(last.frequency.value).toBe(10000);
    expect(last.gain.value).toBe(5);

    rerender(
      <Equalizer
        audioContext={ctx}
        previousNode={prev}
        data={{ 60: 0, 10000: 2 }}
        preAmp={0}
      />,
    );

    expect(last.gain.value).toBe(2);
  });
});
