import { pluginFactory } from '../pluginFactory';

export type StereoProps = {
  value: number;
};

class StereoPlugin {
  createNode(ctx: AudioContext, props: StereoProps): StereoPannerNode {
    const node = ctx.createStereoPanner();
    node.pan.value = props.value;
    return node;
  }
  updateNode(node: StereoPannerNode, props: StereoProps): void {
    node.pan.value = props.value;
  }
}

export const Stereo = pluginFactory<StereoProps, StereoPannerNode>(
  new StereoPlugin(),
);
