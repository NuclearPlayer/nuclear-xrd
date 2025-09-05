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

export const AllAnchors: Story = {
  render: () => (
    <div className="relative grid h-full w-full grid-cols-2 gap-4 p-20">
      <Popover
        trigger={<Button>Opens top</Button>}
        children="Popover content"
        anchor="top"
      />
      <Popover
        trigger={<Button>Opens below</Button>}
        children="Popover content"
        anchor="bottom"
      />
      <Popover
        trigger={<Button>Opens right</Button>}
        children="Popover content"
        anchor="right"
      />
      <Popover
        trigger={<Button>Opens left</Button>}
        children="Popover content"
        anchor="left"
      />
    </div>
  ),
};
