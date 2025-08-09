import type { Meta, StoryObj } from '@storybook/react';
import {
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';

import { BottomBar, Button } from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/BottomBar',
  component: BottomBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BottomBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithText: Story = {
  args: {
    children: <span className="text-foreground">Status: Ready</span>,
  },
};

export const PlayerControls: Story = {
  args: {
    children: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="text">
              <Shuffle size={16} />
            </Button>
            <Button size="icon" variant="text">
              <SkipBack size={16} />
            </Button>
            <Button size="icon">
              <Play size={16} />
            </Button>
            <Button size="icon" variant="text">
              <SkipForward size={16} />
            </Button>
            <Button size="icon" variant="text">
              <Repeat size={16} />
            </Button>
          </div>
        </div>

        <div className="flex-1 mx-8">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground">
              Song Title
            </div>
            <div className="text-xs text-foreground-secondary">Artist Name</div>
          </div>
          <div className="mt-2 bg-background-secondary rounded-full h-1">
            <div className="bg-primary h-1 rounded-full w-1/3"></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="text">
            <Volume2 size={16} />
          </Button>
          <div className="w-20 bg-background-secondary rounded-full h-1">
            <div className="bg-primary h-1 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    ),
  },
};

export const StatusBar: Story = {
  args: {
    children: (
      <div className="flex items-center justify-between w-full text-sm">
        <div className="flex items-center gap-4">
          <span className="text-foreground">♪ 1,247 tracks</span>
          <span className="text-foreground-secondary">•</span>
          <span className="text-foreground-secondary">3.2 GB</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-foreground-secondary">Scanning library...</span>
          <div className="w-32 bg-background-secondary rounded-full h-1">
            <div className="bg-accent-green h-1 rounded-full w-2/3"></div>
          </div>
        </div>
      </div>
    ),
  },
};

export const CustomStyling: Story = {
  args: {
    className: 'bg-accent-purple border-accent-purple',
    children: (
      <div className="text-white font-bold">
        Custom styled bottom bar with purple theme
      </div>
    ),
  },
};
