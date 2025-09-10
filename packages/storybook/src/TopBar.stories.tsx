import type { Meta, StoryObj } from '@storybook/react-vite';

import { TopBar } from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/TopBar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  args: {
    children: (
      <div className="ml-4 flex items-center gap-4">
        <span className="text-muted-foreground text-sm">
          Nuclear Music Player
        </span>
        <div className="flex gap-2">
          <button className="bg-secondary rounded px-2 py-1 text-xs">
            File
          </button>
          <button className="bg-secondary rounded px-2 py-1 text-xs">
            Edit
          </button>
          <button className="bg-secondary rounded px-2 py-1 text-xs">
            View
          </button>
        </div>
      </div>
    ),
  },
};

export const CustomClassName: Story = {
  args: {
    className: 'bg-red-500',
    children: <span className="ml-4 text-white">Custom styled TopBar</span>,
  },
};
