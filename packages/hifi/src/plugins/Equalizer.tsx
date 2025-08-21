import { pluginFactory } from '../pluginFactory';

export type EqualizerProps = {
  data: Record<number, number>;
  preAmp?: number;
};

class EqualizerPlugin {
  createNode(ctx: AudioContext, props: EqualizerProps): BiquadFilterNode[] {
    const { data, preAmp = 0 } = props;
    const freqs = Object.keys(data)
      .map(Number)
      .sort((a, b) => a - b);
    return freqs.map((freq, idx) => {
      const node = ctx.createBiquadFilter();
      node.frequency.value = freq;
      node.gain.value = data[freq] + preAmp;
      if (idx === 0) {
        node.type = 'lowshelf';
      } else if (idx === freqs.length - 1) {
        node.type = 'highshelf';
      } else {
        node.type = 'peaking';
        const diff = Math.abs(freqs[idx + 1] - freqs[idx - 1]);
        node.Q.value = (2 * freq) / (diff || 1);
      }
      return node;
    });
  }
  updateNode(nodes: BiquadFilterNode[], props: EqualizerProps): void {
    const { data, preAmp = 0 } = props;
    nodes.forEach((node) => {
      node.gain.value = (data[node.frequency.value] ?? 0) + preAmp;
    });
  }
}

export const Equalizer = pluginFactory<EqualizerProps, BiquadFilterNode[]>(
  new EqualizerPlugin(),
);
