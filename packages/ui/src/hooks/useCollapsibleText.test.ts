import { act, renderHook } from '@testing-library/react';

import { useCollapsibleText } from './useCollapsibleText';

const multiLineMessage = [
  'Line 1: Starting initialization',
  'Line 2: Loading config',
  'Line 3: Connecting to service',
  'Line 4: Authenticating user',
  'Line 5: Ready',
].join('\n');

const longSingleLineMessage =
  'parsed release response RemoteRelease { version: Version { major: 1, minor: 6, patch: 2 }, notes: Some("Nuclear Player release v1.6.2"), pub_date: Some(2026-02-20 1:57:34.261 +00:00:00), data: Static { platforms: {"windows-x86_64": ReleaseManifestPlatform { url: Url { scheme: "https", cannot_be_a_base: false, username: "", password: None, host: Some(Domain("github.com")), port: None, path: "/NuclearPlayer/nuclear-xrd/releases/download/player%401.6.2/nuclear-music-player_1.6.2_x64_en-US.msi" } } }';

describe('useCollapsibleText', () => {
  it('short text is not collapsible', () => {
    const { result } = renderHook(() =>
      useCollapsibleText('Application started'),
    );

    expect(result.current.isCollapsible).toBe(false);
    expect(result.current.displayedText).toBe('Application started');
    expect(result.current.isExpanded).toBe(false);
  });

  it('multi-line text is collapsed by default, showing first 3 lines', () => {
    const { result } = renderHook(() => useCollapsibleText(multiLineMessage));

    expect(result.current.isCollapsible).toBe(true);
    expect(result.current.isExpanded).toBe(false);
    expect(result.current.displayedText).toBe(
      'Line 1: Starting initialization\nLine 2: Loading config\nLine 3: Connecting to service',
    );
  });

  it('long single-line text is collapsed by default, showing first 300 chars with ellipsis', () => {
    const { result } = renderHook(() =>
      useCollapsibleText(longSingleLineMessage),
    );

    expect(result.current.isCollapsible).toBe(true);
    expect(result.current.isExpanded).toBe(false);
    expect(result.current.displayedText).toHaveLength(301);
    expect(result.current.displayedText.endsWith('…')).toBe(true);
  });

  it('toggle expands and collapses the text', () => {
    const { result } = renderHook(() => useCollapsibleText(multiLineMessage));

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isExpanded).toBe(true);
    expect(result.current.displayedText).toBe(multiLineMessage);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isExpanded).toBe(false);
    expect(result.current.displayedText).toBe(
      'Line 1: Starting initialization\nLine 2: Loading config\nLine 3: Connecting to service',
    );
  });
});
