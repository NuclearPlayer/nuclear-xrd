import React, { useEffect, useRef } from 'react';

export type PluginFactoryProps<N = AudioNode> = {
  audioContext: AudioContext;
  previousNode?: AudioNode;
  onRegister?: (node: N) => void;
  [key: string]: any;
};

export type Plugin<N = AudioNode, P = any> = {
  createNode: (ctx: AudioContext, props: P) => N;
  updateNode?: (node: N, props: P, ctx: AudioContext) => void;
};

export function pluginFactory<P, N = AudioNode | AudioNode[]>(
  plugin: Plugin<N, P>,
) {
  return (props: PluginFactoryProps<N> & P) => {
    const nodeRef = useRef<N | null>(null);
    const { audioContext, previousNode, onRegister, ...pluginProps } = props;

    // Create node and connect to previousNode
    useEffect(() => {
      if (!audioContext || !previousNode) return;
      const node = plugin.createNode(audioContext, pluginProps as P);
      nodeRef.current = node;
      if (Array.isArray(node)) {
        let last = node[0];
        previousNode.connect(last);
        for (let i = 1; i < node.length; i++) {
          last.connect(node[i]);
          last = node[i];
        }
        onRegister?.(node[node.length - 1]);
      } else {
        previousNode.connect(node as AudioNode);
        onRegister?.(node as N);
      }
      return () => {
        if (Array.isArray(node)) {
          node.forEach((n) => n.disconnect());
        } else {
          (node as AudioNode).disconnect();
        }
      };
    }, [audioContext, previousNode]);

    // Update node when props change
    useEffect(() => {
      if (!audioContext || !nodeRef.current || !plugin.updateNode) return;
      plugin.updateNode(nodeRef.current, pluginProps as P, audioContext);
    }, [audioContext, pluginProps]);

    return null;
  };
}
