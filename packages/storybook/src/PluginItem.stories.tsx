import type { Meta, StoryObj } from '@storybook/react';
import {
  Download,
  Headphones,
  Heart,
  Music,
  Palette,
  Radio,
  Star,
  Zap,
} from 'lucide-react';

import { PluginItem } from '@nuclearplayer/ui';

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

export const ThemeExample: Story = {
  args: {
    name: 'Dark Theme Pro',
    author: 'ThemeStudio',
    description:
      'A sleek dark theme with customizable accent colors and improved readability.',
    icon: <Palette size={24} />,
  },
};

export const LongDescription: Story = {
  args: {
    name: 'Advanced Equalizer',
    author: 'AudioTech Solutions',
    description:
      'Professional-grade 10-band equalizer with presets for different music genres, custom curve editing, and real-time spectrum analysis. Includes bass boost, treble enhancement, and spatial audio effects.',
    icon: <Zap size={24} />,
  },
};

export const PluginShowcase = () => (
  <div className="space-y-4 max-w-2xl">
    <h2 className="text-xl font-bold text-foreground mb-6">
      Available Plugins
    </h2>

    <PluginItem
      name="YouTube Music"
      author="Nuclear Team"
      description="Stream music directly from YouTube Music with full search and playlist support."
      icon={<Music size={24} />}
      onViewDetails={() => console.log('YouTube Music details')}
    />

    <PluginItem
      name="Spotify Connect"
      author="Community"
      description="Connect to your Spotify account and access your playlists, liked songs, and recommendations."
      icon={<Headphones size={24} />}
      onViewDetails={() => console.log('Spotify details')}
    />

    <PluginItem
      name="Radio Browser"
      author="Nuclear Team"
      description="Browse and play thousands of internet radio stations from around the world."
      icon={<Radio size={24} />}
      onViewDetails={() => console.log('Radio details')}
    />

    <PluginItem
      name="Download Manager"
      author="DevTools Inc"
      description="Download your favorite tracks for offline listening with metadata and artwork."
      icon={<Download size={24} />}
      onViewDetails={() => console.log('Download Manager details')}
    />
  </div>
);

export const ThemeShowcase = () => (
  <div className="space-y-4 max-w-2xl">
    <h2 className="text-xl font-bold text-foreground mb-6">Available Themes</h2>

    <PluginItem
      name="Neon Nights"
      author="DesignStudio"
      description="Vibrant neon colors with a cyberpunk aesthetic. Perfect for late-night listening sessions."
      icon={<Palette size={24} />}
      onViewDetails={() => console.log('Neon Nights details')}
    />

    <PluginItem
      name="Minimal White"
      author="CleanDesign Co"
      description="Clean, minimalist white theme with subtle shadows and excellent readability."
      icon={<Heart size={24} />}
      onViewDetails={() => console.log('Minimal White details')}
    />

    <PluginItem
      name="Retro Vinyl"
      author="VintageThemes"
      description="Nostalgic theme inspired by classic vinyl records and vintage audio equipment."
      icon={<Star size={24} />}
      onViewDetails={() => console.log('Retro Vinyl details')}
    />
  </div>
);

export const WithoutButton: Story = {
  args: {
    name: 'System Integration',
    author: 'Nuclear Core',
    description:
      'Built-in system integration features for media keys and notifications.',
    icon: <Zap size={24} />,
    onViewDetails: undefined,
  },
};
