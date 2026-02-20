import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CollapsibleText } from './CollapsibleText';

const multiLineMessage = [
  'Line 1: Starting initialization',
  'Line 2: Loading config',
  'Line 3: Connecting to service',
  'Line 4: Authenticating user',
  'Line 5: Ready',
].join('\n');

const longSingleLineMessage =
  'parsed release response RemoteRelease { version: Version { major: 1, minor: 6, patch: 2 }, notes: Some("Nuclear Player release v1.6.2"), pub_date: Some(2026-02-20 1:57:34.261 +00:00:00), data: Static { platforms: {"windows-x86_64": ReleaseManifestPlatform { url: Url { scheme: "https", cannot_be_a_base: false, username: "", password: None, host: Some(Domain("github.com")), port: None, path: "/NuclearPlayer/nuclear-xrd/releases/download/player%401.6.2/nuclear-music-player_1.6.2_x64_en-US.msi" } } } }';

describe('CollapsibleText', () => {
  it('short messages are not collapsible', () => {
    render(<CollapsibleText text="Application started" />);
    expect(screen.queryByTestId('log-expand-toggle')).not.toBeInTheDocument();
  });

  it('long messages are collapsed by default', () => {
    render(<CollapsibleText text={multiLineMessage} />);

    const messageElement = screen.getByTestId('log-message');
    expect(messageElement.textContent).toBe(
      'Line 1: Starting initialization\nLine 2: Loading config\nLine 3: Connecting to service',
    );

    const toggle = screen.getByTestId('log-expand-toggle');
    expect(toggle).toHaveTextContent('Show more');
  });

  it('expand toggle shows full message', async () => {
    const user = userEvent.setup();
    render(<CollapsibleText text={multiLineMessage} />);

    await user.click(screen.getByTestId('log-expand-toggle'));

    expect(screen.getByTestId('log-message').textContent).toBe(
      multiLineMessage,
    );
    expect(screen.getByTestId('log-expand-toggle')).toHaveTextContent(
      'Show less',
    );
  });

  it('collapse toggle truncates message again', async () => {
    const user = userEvent.setup();
    render(<CollapsibleText text={multiLineMessage} />);

    await user.click(screen.getByTestId('log-expand-toggle'));
    await user.click(screen.getByTestId('log-expand-toggle'));

    expect(screen.getByTestId('log-message').textContent).toBe(
      'Line 1: Starting initialization\nLine 2: Loading config\nLine 3: Connecting to service',
    );
    expect(screen.getByTestId('log-expand-toggle')).toHaveTextContent(
      'Show more',
    );
  });

  it('long single-line messages are collapsed by character count', () => {
    render(<CollapsibleText text={longSingleLineMessage} />);

    const messageElement = screen.getByTestId('log-message');
    expect(messageElement.textContent).toHaveLength(301);
    expect(messageElement.textContent?.endsWith('…')).toBe(true);

    const toggle = screen.getByTestId('log-expand-toggle');
    expect(toggle).toHaveTextContent('Show more');
  });

  it('expanding a long single-line message shows full text', async () => {
    const user = userEvent.setup();
    render(<CollapsibleText text={longSingleLineMessage} />);

    await user.click(screen.getByTestId('log-expand-toggle'));

    expect(screen.getByTestId('log-message').textContent).toBe(
      longSingleLineMessage,
    );
    expect(screen.getByTestId('log-expand-toggle')).toHaveTextContent(
      'Show less',
    );
  });
});
