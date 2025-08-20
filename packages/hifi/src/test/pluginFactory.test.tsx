import { render } from '@testing-library/react';

import { Plugin, pluginFactory } from '../pluginFactory';

type Props = { value: number };

let updateCalls = 0;

const createdNode = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connect: (_: unknown) => undefined,
  disconnect: () => undefined,
} as unknown as AudioNode;
const testPlugin: Plugin<AudioNode, Props> = {
  createNode: () => createdNode,
  updateNode: () => {
    updateCalls += 1;
  },
};

const prevNode = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connect: (_: unknown) => undefined,
  disconnect: () => undefined,
} as unknown as AudioNode;
const ctx = {
  createGain: () => ({}) as unknown as GainNode,
} as unknown as AudioContext;

const Comp = pluginFactory<Props, AudioNode>(testPlugin);

describe('pluginFactory', () => {
  it('creates node and calls onRegister, then updates on prop change', () => {
    updateCalls = 0;
    const onRegister = vi.fn();
    const { rerender } = render(
      <Comp
        audioContext={ctx}
        previousNode={prevNode}
        onRegister={onRegister}
        value={1}
      />,
    );
    expect(onRegister).toHaveBeenCalledWith(createdNode);
    rerender(
      <Comp
        audioContext={ctx}
        previousNode={prevNode}
        onRegister={onRegister}
        value={2}
      />,
    );
    expect(updateCalls).toBe(2);
  });
});
