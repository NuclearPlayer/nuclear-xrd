import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Slider } from '@nuclearplayer/ui';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Basic: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Slider
        label="Opacity"
        defaultValue={30}
        min={0}
        max={100}
        step={5}
        unit="%"
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState(20);
    return (
      <div style={{ width: 360 }}>
        <Slider
          label="Volume"
          value={val}
          onValueChange={setVal}
          min={0}
          max={100}
          step={2}
          unit="%"
        />
        <div style={{ marginTop: 12 }}>Current: {val}%</div>
      </div>
    );
  },
};

export const LargeRange: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Slider
        label="Buffer Size"
        defaultValue={512}
        min={0}
        max={2048}
        step={64}
        unit="px"
      />
    </div>
  ),
};

export const AdvancedComposition: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Slider defaultValue={30} min={0} max={100} step={5} unit="%">
        <Slider.Header label="Opacity" />
        <Slider.Surface>
          <Slider.Track />
          <Slider.RangeInput />
        </Slider.Surface>
        <Slider.Footer />
      </Slider>
    </div>
  ),
};
