import { pluginFactory } from '../pluginFactory';

export type VolumeProps = {
  value: number;
};

class VolumePlugin {
  createNode(ctx: AudioContext, props: VolumeProps): GainNode {
    const node = ctx.createGain();
    node.gain.value = props.value / 100;
    return node;
  }
  updateNode(node: GainNode, props: VolumeProps): void {
    node.gain.value = props.value / 100;
  }
}

export const Volume = pluginFactory<VolumeProps, GainNode>(new VolumePlugin());
