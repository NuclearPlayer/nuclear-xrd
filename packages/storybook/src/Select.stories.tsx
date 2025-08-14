import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Select } from '@nuclearplayer/ui';

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

const OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

export const Basic: Story = {
  args: {
    label: 'Quality',
    options: OPTIONS,
    defaultValue: 'medium',
    description: 'Choose your preferred playback quality.',
  },
};

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState('low');
    return (
      <div style={{ width: 360 }}>
        <Select
          label="Quality"
          options={OPTIONS}
          value={val}
          onValueChange={setVal}
        />
        <div style={{ marginTop: 12 }}>Current: {val}</div>
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: 'Quality',
    options: OPTIONS,
    error: 'Please make a selection',
  },
};
