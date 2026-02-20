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

const collapsibleEntry: LogEntryData = {
  ...baseEntry,
  id: 'test-collapsible',
  message: [
    'Line 1: Starting initialization',
    'Line 2: Loading config',
    'Line 3: Connecting to service',
    'Line 4: Authenticating user',
    'Line 5: Ready',
  ].join('\n'),
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

  describe('Chevron toggle', () => {
    it('shows a chevron button for collapsible entries', () => {
      render(<LogEntry {...defaultProps} entry={collapsibleEntry} />);
      expect(screen.getByTestId('log-expand-toggle')).toBeInTheDocument();
    });

    it('does not show a chevron button for non-collapsible entries', () => {
      render(<LogEntry {...defaultProps} />);
      expect(screen.queryByTestId('log-expand-toggle')).not.toBeInTheDocument();
    });

    it('expands and collapses the message when clicked', async () => {
      const user = userEvent.setup();
      render(<LogEntry {...defaultProps} entry={collapsibleEntry} />);

      const messageEl = screen.getByTestId('log-message');
      expect(messageEl.textContent).toBe(
        'Line 1: Starting initialization\nLine 2: Loading config\nLine 3: Connecting to service',
      );

      await user.click(screen.getByTestId('log-expand-toggle'));
      expect(messageEl.textContent).toBe(collapsibleEntry.message);

      await user.click(screen.getByTestId('log-expand-toggle'));
      expect(messageEl.textContent).toBe(
        'Line 1: Starting initialization\nLine 2: Loading config\nLine 3: Connecting to service',
      );
    });
  });

  describe('Copy button', () => {
    it('copies full message to clipboard when clicked', async () => {
      const user = userEvent.setup();
      const writeText = vi.fn(() => Promise.resolve());
      vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText);

      render(<LogEntry {...defaultProps} entry={collapsibleEntry} />);

      await user.click(screen.getByTestId('log-copy-button'));

      expect(writeText).toHaveBeenCalledWith(collapsibleEntry.message);
    });
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

  describe('Conditional scope clickability', () => {
    it('renders scope as clickable when isScopeClickable returns true', async () => {
      const user = userEvent.setup();
      const onScopeClick = vi.fn();

      render(
        <LogEntry
          {...defaultProps}
          onScopeClick={onScopeClick}
          isScopeClickable={() => true}
        />,
      );

      const scopeEl = screen.getByTestId('log-scope');

      await user.click(scopeEl);
      expect(onScopeClick).toHaveBeenCalledWith('app');
    });

    it('renders scope as non-clickable when isScopeClickable returns false', async () => {
      const user = userEvent.setup();
      const onScopeClick = vi.fn();

      render(
        <LogEntry
          {...defaultProps}
          onScopeClick={onScopeClick}
          isScopeClickable={() => false}
        />,
      );

      const scopeEl = screen.getByTestId('log-scope');

      await user.click(scopeEl);
      expect(onScopeClick).not.toHaveBeenCalled();
    });

    it('renders scope as button when isScopeClickable is not provided (backward compat)', async () => {
      const user = userEvent.setup();
      const onScopeClick = vi.fn();

      render(<LogEntry {...defaultProps} onScopeClick={onScopeClick} />);

      const scopeEl = screen.getByTestId('log-scope');
      expect(scopeEl.tagName).toBe('BUTTON');

      await user.click(scopeEl);
      expect(onScopeClick).toHaveBeenCalledWith('app');
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
