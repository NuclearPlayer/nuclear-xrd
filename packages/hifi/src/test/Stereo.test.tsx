import { render } from '@testing-library/react';
import { cloneElement } from 'react';

import { Stereo } from '../plugins/Stereo';

describe('Stereo', () => {
  it('sets and updates pan value', () => {
    const created: Array<{
      pan: { value: number };
      connect: () => void;
      disconnect: () => void;
    }> = [];
    const ctx = {
      createStereoPanner: () => {
        const node = {
          pan: { value: 0 },
          connect: () => undefined,
          disconnect: () => undefined,
        };
        created.push(node);
        return node as unknown as StereoPannerNode;
      },
    } as AudioContext;

    const previousNode = { connect: () => undefined } as unknown as AudioNode;

    let WrappedStereo = cloneElement(<Stereo value={-0.5} />, {
      audioContext: ctx,
      previousNode,
    });

    const { rerender } = render(WrappedStereo);

    expect(created).toMatchInlineSnapshot(`
      [
        {
          "connect": [Function],
          "disconnect": [Function],
          "pan": {
            "value": -0.5,
          },
        },
      ]
    `);

    WrappedStereo = cloneElement(<Stereo value={0.75} />, {
      audioContext: ctx,
      previousNode,
    });

    rerender(WrappedStereo);
    expect(created).toMatchInlineSnapshot(`
      [
        {
          "connect": [Function],
          "disconnect": [Function],
          "pan": {
            "value": 0.75,
          },
        },
      ]
    `);
  });
});
