import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Input } from '@nuclearplayer/ui';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const TextBasic: Story = {
  args: {
    label: 'Username',
    placeholder: 'your-username',
    description: 'This is your public display name.',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: '••••••••',
    variant: 'password',
  },
};

export const NumberControlled: Story = {
  render: () => {
    const [n, setN] = useState(42);
    return (
      <div style={{ width: 360 }}>
        <Input
          label="Buffer Size"
          variant="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          min={0}
          max={2048}
          step={1}
        />
        <div style={{ marginTop: 12 }}>Current: {n}</div>
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: 'Username',
    placeholder: 'your-username',
    error: 'Username is already taken',
    description: 'Choose something unique and memorable.',
  },
};

export const ErrorNoDescription: Story = {
  args: {
    label: 'Username',
    placeholder: 'your-username',
    error: 'Username is already taken',
  },
};
