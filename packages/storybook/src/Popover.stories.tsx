import { Meta, StoryObj } from '@storybook/react-vite';

import { Button, Popover } from '@nuclearplayer/ui';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
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
    <div className="h-full w-full">
      <Popover
        className="relative"
        trigger={<Button className="relative flex">Opens top</Button>}
        children="Popover content"
        anchor="top"
      />
      <Popover
        className="relative"
        trigger={<Button>Opens below</Button>}
        children="Popover content"
        anchor="bottom"
      />
      <Popover
        className="relative"
        trigger={<Button>Opens right</Button>}
        children="Popover content"
        anchor="right"
      />
      <Popover
        className="relative"
        trigger={<Button>Opens left</Button>}
        children="Popover content"
        anchor="left"
      />
    </div>
  ),
};
