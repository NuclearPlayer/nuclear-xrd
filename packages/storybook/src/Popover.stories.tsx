import { Meta, StoryObj } from '@storybook/react';

import { Button, Popover } from '@nuclearplayer/ui';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Meta<typeof Popover>>;

export const Default: Story = {
  args: {
    trigger: <Button>Open Popover</Button>,
    children: 'Popover content',
    anchor: 'bottom',
  },
};
