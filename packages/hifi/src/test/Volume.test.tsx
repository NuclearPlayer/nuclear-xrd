import { render } from '@testing-library/react';
import { cloneElement } from 'react';

import { Volume } from '../plugins/Volume';

describe('Volume', () => {
  it('sets and updates gain value as 0..1', () => {
    const nodes: Array<{
      gain: { value: number };
      connect: () => void;
      disconnect: () => void;
    }> = [];
    const ctx = {
      createGain: () => {
        const node = {
          gain: { value: 0 },
          connect: () => undefined,
          disconnect: () => undefined,
        };
        nodes.push(node);
        return node as unknown as GainNode;
      },
    } as AudioContext;

    const previousNode = { connect: () => undefined } as unknown as AudioNode;
    let WrappedVolume = cloneElement(<Volume value={50} />, {
      audioContext: ctx,
      previousNode,
    });

    const { rerender } = render(WrappedVolume);
    expect(nodes).toMatchInlineSnapshot(`
      [
        {
          "connect": [Function],
          "disconnect": [Function],
          "gain": {
            "value": 0.5,
          },
        },
      ]
    `);

    WrappedVolume = cloneElement(WrappedVolume, { value: 80 });
    rerender(WrappedVolume);
    expect(nodes).toMatchInlineSnapshot(`
      [
        {
          "connect": [Function],
          "disconnect": [Function],
          "gain": {
            "value": 0.8,
          },
        },
      ]
    `);
  });
});
