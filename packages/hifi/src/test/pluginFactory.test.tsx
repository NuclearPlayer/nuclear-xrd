import { render } from '@testing-library/react';
import { cloneElement } from 'react';

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
    const previousNode = {
      connect: prevConnect,
      disconnect: () => undefined,
    } as unknown as AudioNode;
    const ctx = {} as AudioContext;
    const Comp = pluginFactory<Props, AudioNode>(testPlugin);
    const onRegister = vi.fn();

    let WrappedComp = cloneElement(<Comp value={1} />, {
      audioContext: ctx,
      previousNode,
      onRegister,
    });

    const { rerender, unmount } = render(WrappedComp);
    expect(prevConnect).toHaveBeenCalledTimes(1);
    expect(prevConnect).toHaveBeenCalledWith(createdNode);
    expect(onRegister).toHaveBeenCalledTimes(1);
    expect(onRegister).toHaveBeenCalledWith(createdNode);

    WrappedComp = cloneElement(<Comp value={2} />, {
      audioContext: ctx,
      previousNode,
      onRegister,
    });

    rerender(WrappedComp);
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

    const WrappedComp = cloneElement(<Comp id="x" />, {
      audioContext: ctx,
      previousNode: prev,
      onRegister,
    });

    render(WrappedComp);

    expect(prevConnect).toHaveBeenCalledWith(a);
    expect(a.connect).toHaveBeenCalledWith(b);
    expect(onRegister).toHaveBeenCalledWith(b);
  });
});
