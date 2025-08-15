import type { Meta, StoryObj } from '@storybook/react';
import { Music, Palette } from 'lucide-react';

import { PluginItem, Toggle } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/PluginItem',
  component: PluginItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onViewDetails: { action: 'view details clicked' },
  },
} satisfies Meta<typeof PluginItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'YouTube Music',
    author: 'Nuclear Team',
    description:
      'Stream music directly from YouTube Music with full search and playlist support.',
    icon: <Music size={24} />,
  },
};

export const WithoutIcon: Story = {
  args: {
    name: 'Last.fm Scrobbler',
    author: 'Community',
    description:
      'Automatically scrobble your listening history to Last.fm and discover new music based on your taste.',
  },
};

export const LongDescription: Story = {
  args: {
    name: 'Advanced Equalizer',
    author: 'AudioTech Solutions',
    description:
      'Professional-grade 10-band equalizer with presets for different music genres, custom curve editing, and real-time spectrum analysis. Includes bass boost, treble enhancement, and spatial audio effects.',
    icon: <Palette size={24} />,
  },
};

// New variants showcasing the enhanced API

export const Disabled: Story = {
  args: {
    name: 'Disabled Plugin',
    author: 'Nuclear Team',
    description: 'This plugin is currently disabled.',
    icon: <Music size={24} />,
    disabled: true,
  },
};

export const Warning: Story = {
  args: {
    name: 'Warned Plugin',
    author: 'Nuclear Team',
    description: 'This plugin has warnings.',
    icon: <Music size={24} />,
    warning: true,
    warningText: 'Unknown permissions',
  },
};

export const WithRightAccessory: Story = {
  args: {
    name: 'Toggleable Plugin',
    author: 'Nuclear Team',
    description: 'This plugin shows a right accessory toggle.',
    icon: <Music size={24} />,
    rightAccessory: (
      <Toggle
        defaultChecked={false}
        aria-label="Enable plugin"
        onChange={(checked) => console.log('Toggle changed:', checked)}
      />
    ),
  },
};

export const WarningWithRightAccessory: Story = {
  args: {
    name: 'Warned + Toggle',
    author: 'Nuclear Team',
    description: 'Warned plugin with a right accessory toggle.',
    icon: <Music size={24} />,
    warning: true,
    warningText: 'Requires network permission',
    rightAccessory: (
      <Toggle
        defaultChecked={true}
        aria-label="Enable plugin"
        onChange={(checked) => console.log('Toggle changed:', checked)}
      />
    ),
  },
};

export const DisabledWarningWithRightAccessory: Story = {
  args: {
    name: 'Disabled + Warned + Toggle',
    author: 'Nuclear Team',
    description: 'Disabled plugin with warnings and a toggle in the top-right.',
    icon: <Music size={24} />,
    disabled: true,
    warning: true,
    warningText: 'Unknown permissions',
    rightAccessory: (
      <Toggle
        defaultChecked={false}
        aria-label="Enable plugin"
        onChange={(checked) => console.log('Toggle changed:', checked)}
      />
    ),
  },
};
