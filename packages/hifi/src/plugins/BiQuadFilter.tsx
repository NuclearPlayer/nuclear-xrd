import { pluginFactory } from '../pluginFactory';

export type BiQuadFilterProps = {
  value: number;
  freq: number;
  q?: number;
  type: BiquadFilterType;
};

class BiQuadFilterPlugin {
  createNode(ctx: AudioContext, props: BiQuadFilterProps): BiquadFilterNode {
    const node = ctx.createBiquadFilter();
    node.type = props.type;
    node.frequency.value = props.freq;
    node.gain.value = props.value;
    if (props.q != null) {
      node.Q.value = props.q;
    }
    return node;
  }
  updateNode(node: BiquadFilterNode, props: BiQuadFilterProps): void {
    node.gain.value = props.value;
    if (props.q != null) {
      node.Q.value = props.q;
    }
  }
}

export const BiQuadFilter = pluginFactory<BiQuadFilterProps, BiquadFilterNode>(
  new BiQuadFilterPlugin(),
);
