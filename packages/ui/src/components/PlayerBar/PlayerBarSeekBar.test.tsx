import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import '@nuclearplayer/tailwind-config';

import { PlayerBarSeekBar } from './PlayerBarSeekBar';

describe('PlayerBarSeekBar', () => {
  it('(Snapshot) default render', () => {
    const { asFragment } = render(
      <PlayerBarSeekBar
        progress={25}
        elapsedSeconds={97}
        remainingSeconds={1297}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onSeek with percent based on click position', () => {
    const onSeek = vi.fn();
    render(
      <div style={{ width: 200 }}>
        <PlayerBarSeekBar
          progress={0}
          elapsedSeconds={0}
          remainingSeconds={0}
          onSeek={onSeek}
        />
      </div>,
    );
    const container = document.querySelector('[aria-disabled]') as HTMLElement;
    const rect = {
      left: 0,
      width: 200,
      top: 0,
      height: 8,
      right: 200,
      bottom: 8,
    };
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(
      rect as DOMRect,
    );
    fireEvent.click(container, { clientX: 50 });
    expect(onSeek).toHaveBeenCalledWith(25);
    fireEvent.click(container, { clientX: 200 });
    expect(onSeek).toHaveBeenCalledWith(100);
  });

  it('does not call onSeek when loading', () => {
    const onSeek = vi.fn();
    render(
      <div style={{ width: 200 }}>
        <PlayerBarSeekBar
          progress={50}
          elapsedSeconds={0}
          remainingSeconds={0}
          isLoading
          onSeek={onSeek}
        />
      </div>,
    );
    const container = document.querySelector(
      '[aria-disabled="true"]',
    ) as HTMLElement;
    const rect = {
      left: 0,
      width: 200,
      top: 0,
      height: 8,
      right: 200,
      bottom: 8,
    };
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(
      rect as DOMRect,
    );
    fireEvent.click(container, { clientX: 100 });
    expect(onSeek).not.toHaveBeenCalled();
  });
});
