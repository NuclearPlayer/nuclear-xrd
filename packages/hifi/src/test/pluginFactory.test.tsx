import { render } from '@testing-library/react';

import { Plugin, pluginFactory } from '../pluginFactory';

describe('pluginFactory', () => {
  it('creates a single node, connects after previousNode, registers it, and updates on prop change', () => {
    type Props = { value: number };
    let updateCalls = 0;
    const createdNode = {
      connect: () => undefined,
      disconnect: () => undefined,
    } as unknown as AudioNode;
    const testPlugin: Plugin<AudioNode, Props> = {
      createNode: () => createdNode,
      updateNode: () => {
        updateCalls += 1;
      },
    };
    const prevConnect = vi.fn();
    const prevNode = {
      connect: prevConnect,
      disconnect: () => undefined,
    } as unknown as AudioNode;
    const ctx = {} as AudioContext;
    const Comp = pluginFactory<Props, AudioNode>(testPlugin);
    const onRegister = vi.fn();

    const { rerender, unmount } = render(
      <Comp
        audioContext={ctx}
        previousNode={prevNode}
        onRegister={onRegister}
        value={1}
      />,
    );
    expect(prevConnect).toHaveBeenCalledTimes(1);
    expect(prevConnect).toHaveBeenCalledWith(createdNode);
    expect(onRegister).toHaveBeenCalledTimes(1);
    expect(onRegister).toHaveBeenCalledWith(createdNode);

    rerender(
      <Comp
        audioContext={ctx}
        previousNode={prevNode}
        onRegister={onRegister}
        value={2}
      />,
    );
    expect(updateCalls).toBeGreaterThan(0);

    unmount();
  });

  it('creates a chain, connects sequentially, and registers the last node', () => {
    type Props = { id: string };
    const a = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as AudioNode;
    const b = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as AudioNode;
    class ChainPlugin implements Plugin<AudioNode[], Props> {
      createNode(): AudioNode[] {
        return [a, b];
      }
    }
    const prevConnect = vi.fn();
    const prev = { connect: prevConnect } as unknown as AudioNode;
    const ctx = {} as AudioContext;
    const Comp = pluginFactory<Props, AudioNode[]>(new ChainPlugin());
    const onRegister = vi.fn();

    render(
      <Comp
        audioContext={ctx}
        previousNode={prev}
        onRegister={onRegister}
        id="x"
      />,
    );

    expect(prevConnect).toHaveBeenCalledWith(a);
    expect(a.connect).toHaveBeenCalledWith(b);
    expect(onRegister).toHaveBeenCalledWith(b);
  });
});
