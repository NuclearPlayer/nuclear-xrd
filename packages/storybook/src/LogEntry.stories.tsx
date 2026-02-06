import { Meta, StoryObj } from '@storybook/react-vite';

import { LogEntry, LogEntryData } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/LogEntry',
  component: LogEntry,
  tags: ['autodocs'],
} satisfies Meta<typeof LogEntry>;

export default meta;

type Story = StoryObj<typeof LogEntry>;

export const AllVariants: Story = {
  render: () => {
    const entries: LogEntryData[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 0),
        level: 'error',
        source: { type: 'plugin', scope: 'spotify' },
        message: 'Authentication failed: Invalid credentials',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000),
        level: 'warn',
        source: { type: 'core', scope: 'http' },
        message: 'Rate limited, backing off for 5s',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 2000),
        level: 'info',
        source: { type: 'core', scope: 'app' },
        message: 'Application started',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 3000),
        level: 'debug',
        source: { type: 'plugin', scope: 'youtube-music' },
        message: 'Searching for: Artist - Track Title',
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 4000),
        level: 'trace',
        source: { type: 'core', scope: 'playback' },
        message: 'Audio buffer: 45.2s remaining',
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 5000),
        level: 'error',
        source: { type: 'core', scope: 'plugins' },
        message: `Plugin failed to load: youtube-music
Error: Cannot read property 'search' of undefined
    at PluginLoader.load (plugin-loader.ts:45)
    at async loadAllPlugins (index.ts:12)`,
      },
    ];
    return (
      <div className="bg-background flex flex-col">
        {entries.map((entry) => (
          <LogEntry key={entry.id} entry={entry} />
        ))}
      </div>
    );
  },
};
