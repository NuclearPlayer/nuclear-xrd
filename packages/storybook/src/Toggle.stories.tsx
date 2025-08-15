import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Toggle } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    checked: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Toggle',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked Toggle',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Toggle',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled Checked Toggle',
    disabled: true,
    defaultChecked: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <Toggle
          label="Controlled Toggle"
          checked={checked}
          onChange={setChecked}
        />
        <p className="text-foreground text-sm">
          Status: {checked ? 'On' : 'Off'}
        </p>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Toggle label="Default" />
        <span className="text-foreground text-xs">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Toggle defaultChecked label="Checked" />
        <span className="text-foreground text-xs">Checked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Toggle disabled label="Disabled" />
        <span className="text-foreground text-xs">Disabled</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Toggle disabled defaultChecked label="Disabled Checked" />
        <span className="text-foreground text-xs">Disabled + Checked</span>
      </div>
    </div>
  ),
};
