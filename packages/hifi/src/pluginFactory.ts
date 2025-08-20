import { useEffect, useRef } from 'react';

export type PluginFactoryProps<N extends AudioNode | AudioNode[], P> = {
  audioContext: AudioContext;
  previousNode?: AudioNode;
  onRegister?: (node: N) => void;
} & P;

export type Plugin<N extends AudioNode | AudioNode[], P> = {
  createNode: (ctx: AudioContext, props: P) => N;
  updateNode?: (node: N, props: P, ctx: AudioContext) => void;
};

export function pluginFactory<P, N extends AudioNode | AudioNode[]>(
  plugin: Plugin<N, P>,
) {
  return (props: PluginFactoryProps<N, P>) => {
    const nodeRef = useRef<N | null>(null);
    const { audioContext, previousNode, onRegister, ...pluginProps } = props;

    useEffect(() => {
      if (!audioContext || !previousNode) {
        return;
      }
      const node = plugin.createNode(audioContext, pluginProps as P);
      nodeRef.current = node;
      if (Array.isArray(node)) {
        let last = node[0];
        previousNode.connect(last);
        for (let i = 1; i < node.length; i++) {
          last.connect(node[i]);
          last = node[i];
        }
        if (onRegister) {
          onRegister(node[node.length - 1] as N);
        }
      } else {
        previousNode.connect(node);
        if (onRegister) {
          onRegister(node);
        }
      }
      return () => {
        if (Array.isArray(node)) {
          node.forEach((n) => n.disconnect());
        } else {
          node.disconnect();
        }
      };
    }, [audioContext, previousNode]);

    useEffect(() => {
      if (!audioContext || !nodeRef.current || !plugin.updateNode) {
        return;
      }
      plugin.updateNode(nodeRef.current, pluginProps as P, audioContext);
    }, [audioContext, pluginProps]);

    return null;
  };
}
