import { render } from '@testing-library/react';
import { cloneElement } from 'react';

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

    const previousNode = { connect: () => undefined } as unknown as AudioNode;

    let WrappedBiQuadFilter = cloneElement(
      <BiQuadFilter type="highpass" freq={1200} value={5} q={0.5} />,
      {
        audioContext: ctx,
        previousNode,
      },
    );

    const { rerender } = render(WrappedBiQuadFilter);

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

    WrappedBiQuadFilter = cloneElement(
      <BiQuadFilter type="highpass" freq={1200} value={2} q={1} />,
      {
        audioContext: ctx,
        previousNode,
      },
    );

    rerender(WrappedBiQuadFilter);

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
