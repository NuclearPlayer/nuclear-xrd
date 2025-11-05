import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { Track } from '@nuclearplayer/model';
import { QueueItem } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/QueueItem',
  component: QueueItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['idle', 'loading', 'error'],
    },
    isCurrent: { control: 'boolean' },
    isCollapsed: { control: 'boolean' },
    onSelect: { action: 'selected' },
    onRemove: { action: 'removed' },
  },
} satisfies Meta<typeof QueueItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTrack: Track = {
  title: 'Bohemian Rhapsody',
  artists: [{ name: 'Queen', roles: ['primary'] }],
  durationMs: 354000,
  source: { provider: 'test', id: '1' },
  artwork: {
    items: [
      {
        url: 'https://picsum.photos/seed/queen/300',
        width: 300,
        height: 300,
        purpose: 'thumbnail',
      },
    ],
  },
};

const mockTrackNoArtwork: Track = {
  title: 'Untitled Track',
  artists: [{ name: 'Unknown Artist', roles: ['primary'] }],
  durationMs: 180000,
  source: { provider: 'test', id: '2' },
};

const mockTrackLongTitle: Track = {
  title: 'This is an Incredibly Long Track Title That Should Truncate Properly',
  artists: [
    {
      name: 'An Artist With A Very Long Name Featuring Another Artist',
      roles: ['primary'],
    },
  ],
  durationMs: 420000,
  source: { provider: 'test', id: '3' },
  artwork: {
    items: [
      {
        url: 'https://picsum.photos/seed/long/300',
        width: 300,
        height: 300,
        purpose: 'thumbnail',
      },
    ],
  },
};

export const Default: Story = {
  args: {
    track: mockTrack,
    onSelect: fn(),
    onRemove: fn(),
  },
};

export const Current: Story = {
  args: {
    track: mockTrack,
    isCurrent: true,
    onSelect: fn(),
    onRemove: fn(),
  },
};

export const Loading: Story = {
  args: {
    track: mockTrack,
    status: 'loading',
    onSelect: fn(),
    onRemove: fn(),
  },
};

export const Error: Story = {
  args: {
    track: mockTrack,
    status: 'error',
    errorMessage: 'Failed to load stream',
    onSelect: fn(),
    onRemove: fn(),
  },
};

export const CurrentAndLoading: Story = {
  args: {
    track: mockTrack,
    isCurrent: true,
    status: 'loading',
    onSelect: fn(),
    onRemove: fn(),
  },
};

export const CurrentAndError: Story = {
  args: {
    track: mockTrack,
    isCurrent: true,
    status: 'error',
    errorMessage: 'Stream unavailable',
    onSelect: fn(),
    onRemove: fn(),
  },
};

export const NoArtwork: Story = {
  args: {
    track: mockTrackNoArtwork,
    onSelect: fn(),
    onRemove: fn(),
  },
};

export const NoDuration: Story = {
  args: {
    track: {
      ...mockTrack,
      durationMs: undefined,
    },
    onSelect: fn(),
    onRemove: fn(),
  },
};

export const LongText: Story = {
  args: {
    track: mockTrackLongTitle,
    onSelect: fn(),
    onRemove: fn(),
  },
};

export const WithoutCallbacks: Story = {
  args: {
    track: mockTrack,
  },
};

export const Collapsed: Story = {
  args: {
    track: mockTrack,
    isCollapsed: true,
    onSelect: fn(),
  },
};

export const CollapsedCurrent: Story = {
  args: {
    track: mockTrack,
    isCollapsed: true,
    isCurrent: true,
    onSelect: fn(),
  },
};

export const CollapsedLoading: Story = {
  args: {
    track: mockTrack,
    isCollapsed: true,
    status: 'loading',
    onSelect: fn(),
  },
};

export const CollapsedNoArtwork: Story = {
  args: {
    track: mockTrackNoArtwork,
    isCollapsed: true,
    onSelect: fn(),
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <QueueItem track={mockTrack} onSelect={fn()} onRemove={fn()} />
      <QueueItem track={mockTrack} isCurrent onSelect={fn()} onRemove={fn()} />
      <QueueItem
        track={mockTrack}
        status="loading"
        onSelect={fn()}
        onRemove={fn()}
      />
      <QueueItem
        track={mockTrack}
        status="error"
        errorMessage="Failed to load"
        onSelect={fn()}
        onRemove={fn()}
      />
      <QueueItem track={mockTrackNoArtwork} onSelect={fn()} onRemove={fn()} />
    </div>
  ),
};

export const CollapsedStates: Story = {
  render: () => (
    <div className="flex gap-4">
      <QueueItem track={mockTrack} isCollapsed onSelect={fn()} />
      <QueueItem track={mockTrack} isCollapsed isCurrent onSelect={fn()} />
      <QueueItem
        track={mockTrack}
        isCollapsed
        status="loading"
        onSelect={fn()}
      />
      <QueueItem track={mockTrack} isCollapsed status="error" onSelect={fn()} />
      <QueueItem track={mockTrackNoArtwork} isCollapsed onSelect={fn()} />
    </div>
  ),
};
