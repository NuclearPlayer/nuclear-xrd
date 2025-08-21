import { render } from '@testing-library/react';

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
    } as unknown as AudioContext;

    const prev = { connect: () => undefined } as unknown as AudioNode;

    const { rerender } = render(
      <Volume audioContext={ctx} previousNode={prev} value={50} />,
    );
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

    rerender(<Volume audioContext={ctx} previousNode={prev} value={80} />);
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
