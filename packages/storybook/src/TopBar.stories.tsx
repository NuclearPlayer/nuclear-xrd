import type { Meta, StoryObj } from '@storybook/react';

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
        <span className="text-sm text-muted-foreground">
          Nuclear Music Player
        </span>
        <div className="flex gap-2">
          <button className="text-xs px-2 py-1 bg-secondary rounded">
            File
          </button>
          <button className="text-xs px-2 py-1 bg-secondary rounded">
            Edit
          </button>
          <button className="text-xs px-2 py-1 bg-secondary rounded">
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
