import { Meta, StoryObj } from '@storybook/react-vite';
import { Package, WifiOff } from 'lucide-react';

import { Button, EmptyState } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'No items found',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'No plugins installed',
    description: 'Browse the store to find plugins for your music player.',
  },
};

export const WithAction: Story = {
  args: {
    icon: <WifiOff size={64} />,
    title: 'Connection failed',
    description: 'Could not reach the server. Please check your connection.',
    action: <Button>Retry</Button>,
  },
};

export const EmptyPluginStore: Story = {
  args: {
    icon: <Package size={64} />,
    title: 'No plugins available',
    description: 'The plugin store is empty. Check back later for new plugins.',
  },
};
