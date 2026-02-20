import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LogEntry, LogEntryData } from './LogEntry';

const baseEntry: LogEntryData = {
  id: 'test-1',
  timestamp: new Date('2026-02-04T12:30:45.123Z'),
  level: 'info',
  target: 'webview',
  source: { type: 'core', scope: 'app' },
  message: 'Application started',
};

const defaultProps = {
  entry: baseEntry,
  onLevelClick: vi.fn(),
  onScopeClick: vi.fn(),
};

describe('LogEntry', () => {
  it('(Snapshot) renders core log entry', () => {
    const { container } = render(<LogEntry {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders plugin log entry', () => {
    const { container } = render(
      <LogEntry
        {...defaultProps}
        entry={{
          ...baseEntry,
          source: { type: 'plugin', scope: 'youtube-music' },
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('formats timestamp with HH:mm:ss.SSS pattern', () => {
    render(<LogEntry {...defaultProps} />);
    expect(screen.getByTestId('log-timestamp')).toHaveTextContent(
      /^\d{2}:\d{2}:\d{2}\.\d{3}$/,
    );
  });

  it('preserves multi-line messages', () => {
    render(
      <LogEntry
        {...defaultProps}
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

  describe('Clickable chips', () => {
    it('calls onLevelClick with the correct level', async () => {
      const user = userEvent.setup();
      const onLevelClick = vi.fn();

      render(<LogEntry {...defaultProps} onLevelClick={onLevelClick} />);

      await user.click(screen.getByTestId('log-level'));

      expect(onLevelClick).toHaveBeenCalledWith('info');
      expect(onLevelClick).toHaveBeenCalledTimes(1);
    });

    it('calls onScopeClick with the correct scope', async () => {
      const user = userEvent.setup();
      const onScopeClick = vi.fn();

      render(<LogEntry {...defaultProps} onScopeClick={onScopeClick} />);

      await user.click(screen.getByTestId('log-scope'));

      expect(onScopeClick).toHaveBeenCalledWith('app');
      expect(onScopeClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Visual delineation', () => {
    it('alternating background applied for odd index', () => {
      const { container } = render(<LogEntry {...defaultProps} index={1} />);

      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv.className).toContain('bg-foreground/[0.03]');
    });
  });
});
