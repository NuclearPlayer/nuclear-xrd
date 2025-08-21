import { render } from '@testing-library/react';

import { BiQuadFilter } from '../plugins/BiQuadFilter';

describe('BiQuadFilter', () => {
  it('sets type/frequency/gain and updates gain and Q', () => {
    const nodes: Array<{
      type: BiquadFilterType;
      frequency: { value: number };
      gain: { value: number };
      Q: { value: number };
      connect: () => void;
      disconnect: () => void;
    }> = [];

    const ctx = {
      createBiquadFilter: () => {
        const node = {
          type: 'peaking' as BiquadFilterType,
          frequency: { value: 0 },
          gain: { value: 0 },
          Q: { value: 0 },
          connect: () => undefined,
          disconnect: () => undefined,
        };
        nodes.push(node);
        return node as unknown as BiquadFilterNode;
      },
    } as unknown as AudioContext;

    const prev = { connect: () => undefined } as unknown as AudioNode;

    const { rerender } = render(
      <BiQuadFilter
        audioContext={ctx}
        previousNode={prev}
        type="highpass"
        freq={1200}
        value={5}
        q={0.5}
      />,
    );

    expect(nodes).toMatchInlineSnapshot(`
      [
        {
          "Q": {
            "value": 0.5,
          },
          "connect": [Function],
          "disconnect": [Function],
          "frequency": {
            "value": 1200,
          },
          "gain": {
            "value": 5,
          },
          "type": "highpass",
        },
      ]
    `);

    rerender(
      <BiQuadFilter
        audioContext={ctx}
        previousNode={prev}
        type="highpass"
        freq={1200}
        value={2}
        q={1}
      />,
    );

    expect(nodes).toMatchInlineSnapshot(`
      [
        {
          "Q": {
            "value": 1,
          },
          "connect": [Function],
          "disconnect": [Function],
          "frequency": {
            "value": 1200,
          },
          "gain": {
            "value": 2,
          },
          "type": "highpass",
        },
      ]
    `);
  });
});
