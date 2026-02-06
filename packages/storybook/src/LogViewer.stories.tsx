import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { LogEntryData, LogViewer } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/LogViewer',
  component: LogViewer,
  tags: ['autodocs'],
} satisfies Meta<typeof LogViewer>;

export default meta;

type Story = StoryObj<typeof LogViewer>;

const generateLogs = (count: number): LogEntryData[] => {
  const levels: LogEntryData['level'][] = [
    'error',
    'warn',
    'info',
    'debug',
    'trace',
  ];
  const sources: Array<{ scope: string; type: 'core' | 'plugin' }> = [
    { scope: 'app', type: 'core' },
    { scope: 'plugins', type: 'core' },
    { scope: 'http', type: 'core' },
    { scope: 'streaming', type: 'core' },
    { scope: 'playback', type: 'core' },
    { scope: 'youtube-music', type: 'plugin' },
    { scope: 'spotify', type: 'plugin' },
  ];
  const messages = [
    'Application started',
    'Plugin loaded successfully',
    'HTTP request to api.example.com/v1/search',
    'Stream resolution started',
    'Playback state changed to playing',
    'Rate limited, backing off for 5s',
    'Failed to authenticate: Invalid credentials',
    'Searching for: Artist - Track Title',
    'Buffer status: 45.2s remaining',
    'Theme changed to dark mode',
    'Settings saved to disk',
    'Queue updated: 12 tracks',
  ];

  const now = Date.now();
  return Array.from({ length: count }).map((_, i) => {
    const level = levels[i % levels.length];
    const source = sources[i % sources.length];
    const message = messages[i % messages.length];

    return {
      id: `log-${i}`,
      timestamp: new Date(now - i * 1000),
      level,
      source,
      message,
    };
  });
};

export const Interactive: Story = {
  render: () => {
    const [logs, setLogs] = useState(() => generateLogs(50));
    const scopes = [...new Set(logs.map((l) => l.source.scope))];

    const handleClear = () => setLogs([]);
    const handleExport = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Exported logs:', logs.length);
    };
    const handleOpenLogFolder = () => {
      console.log('Opening log folder...');
    };

    return (
      <div className="bg-background h-[600px] p-4">
        <LogViewer
          logs={logs}
          scopes={scopes}
          onClear={handleClear}
          onExport={handleExport}
          onOpenLogFolder={handleOpenLogFolder}
        />
      </div>
    );
  },
};

export const ManyLogs: Story = {
  render: () => {
    const [logs] = useState(() => generateLogs(1000));
    const scopes = [...new Set(logs.map((l) => l.source.scope))];

    return (
      <div className="bg-background h-[600px] p-4">
        <LogViewer
          logs={logs}
          scopes={scopes}
          onClear={() => {}}
          onExport={() => {}}
          onOpenLogFolder={() => {}}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    return (
      <div className="bg-background h-[400px] p-4">
        <LogViewer
          logs={[]}
          scopes={[]}
          onClear={() => {}}
          onExport={() => {}}
          onOpenLogFolder={() => {}}
        />
      </div>
    );
  },
};

export const LongMessages: Story = {
  render: () => {
    const logs: LogEntryData[] = [
      {
        id: '1',
        timestamp: new Date(),
        level: 'error',
        source: { type: 'core', scope: 'plugins' },
        message: `Plugin failed to load: youtube-music
Error: Cannot read property 'search' of undefined
    at PluginLoader.load (plugin-loader.ts:45)
    at async loadAllPlugins (index.ts:12)
    at async App.initialize (app.ts:23)`,
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000),
        level: 'debug',
        source: { type: 'core', scope: 'http' },
        message:
          'HTTP Response: {"status":"ok","data":{"tracks":[{"id":"abc123","title":"Very Long Track Title That Goes On And On","artist":"Some Artist With A Really Long Name"}]}}',
      },
    ];

    return (
      <div className="bg-background h-[400px] p-4">
        <LogViewer
          logs={logs}
          scopes={['plugins', 'http']}
          onClear={() => {}}
          onExport={() => {}}
          onOpenLogFolder={() => {}}
        />
      </div>
    );
  },
};
