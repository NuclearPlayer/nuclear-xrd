import { render, screen } from '@testing-library/react';

import { LogEntry, LogEntryData } from './LogEntry';

const baseEntry: LogEntryData = {
  id: 'test-1',
  timestamp: new Date('2026-02-04T12:30:45.123Z'),
  level: 'info',
  source: { type: 'core', scope: 'app' },
  message: 'Application started',
};

describe('LogEntry', () => {
  it('(Snapshot) renders core log entry', () => {
    const { container } = render(<LogEntry entry={baseEntry} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders plugin log entry', () => {
    const { container } = render(
      <LogEntry
        entry={{
          ...baseEntry,
          source: { type: 'plugin', scope: 'youtube-music' },
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('formats timestamp with HH:mm:ss.SSS pattern', () => {
    render(<LogEntry entry={baseEntry} />);
    expect(screen.getByTestId('log-timestamp')).toHaveTextContent(
      /^\d{2}:\d{2}:\d{2}\.\d{3}$/,
    );
  });

  it('preserves multi-line messages', () => {
    render(
      <LogEntry
        entry={{
          ...baseEntry,
          message: 'Line 1\nLine 2\nLine 3',
        }}
      />,
    );
    expect(screen.getByTestId('log-message').textContent).toBe(
      'Line 1\nLine 2\nLine 3',
    );
  });
});
