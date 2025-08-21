import { render } from '@testing-library/react';

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
    } as unknown as AudioContext;

    const prev = { connect: () => undefined } as unknown as AudioNode;

    const { rerender } = render(
      <Stereo audioContext={ctx} previousNode={prev} value={-0.5} />,
    );

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

    rerender(<Stereo audioContext={ctx} previousNode={prev} value={0.75} />);
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
