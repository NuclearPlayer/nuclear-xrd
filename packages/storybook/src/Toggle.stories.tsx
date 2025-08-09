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
      <div className="flex flex-col gap-4 items-center">
        <Toggle
          label="Controlled Toggle"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <p className="text-sm text-foreground">
          Status: {checked ? 'On' : 'Off'}
        </p>
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col gap-2 items-center">
        <Toggle label="Default" />
        <span className="text-xs text-foreground">Default</span>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <Toggle defaultChecked label="Checked" />
        <span className="text-xs text-foreground">Checked</span>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <Toggle disabled label="Disabled" />
        <span className="text-xs text-foreground">Disabled</span>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <Toggle disabled defaultChecked label="Disabled Checked" />
        <span className="text-xs text-foreground">Disabled + Checked</span>
      </div>
    </div>
  ),
};
