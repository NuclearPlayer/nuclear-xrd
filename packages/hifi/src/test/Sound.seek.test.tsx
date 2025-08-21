import { act, render } from '@testing-library/react';

import { Sound } from '../Sound';

describe('Sound seek', () => {
  it('sets currentTime on the active audio element when seek changes', () => {
    const origAudioContext = window.AudioContext;
    const fakeCtx = {
      resume: vi.fn(),
      close: vi.fn(),
      createMediaElementSource: () => ({
        connect: () => ({ connect: () => fakeCtx }),
        disconnect: vi.fn(),
      }),
      createGain: () => ({
        connect: () => fakeCtx,
        disconnect: vi.fn(),
        gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
      }),
      destination: {} as AudioDestinationNode,
    } as unknown as AudioContext;
    window.AudioContext = vi.fn(
      () => fakeCtx,
    ) as unknown as typeof AudioContext;

    const { rerender } = render(<Sound src="/a.mp3" status="paused" />);

    rerender(<Sound src="/a.mp3" status="paused" seek={42} />);

    const audios = document.querySelectorAll('audio');
    const active = audios[0] as HTMLAudioElement;
    expect(active.currentTime).toBe(42);

    window.AudioContext = origAudioContext;
  });

  it('ramps gains and flips active index after crossfade', async () => {
    const gains: Array<{
      gain: {
        setValueAtTime: ReturnType<typeof vi.fn>;
        linearRampToValueAtTime: ReturnType<typeof vi.fn>;
      };
    }> = [];

    const fakeCtx = {
      currentTime: 0,
      resume: vi.fn(),
      close: vi.fn(),
      createMediaElementSource: () => ({
        connect: () => ({ connect: () => fakeCtx }),
        disconnect: vi.fn(),
      }),
      createGain: () => {
        const node = {
          connect: () => fakeCtx,
          disconnect: vi.fn(),
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
          },
        };
        gains.push(node);
        return node;
      },
      destination: {} as AudioDestinationNode,
    } as unknown as AudioContext;

    const origAudioContext = window.AudioContext;
    window.AudioContext = vi.fn(() => fakeCtx) as typeof AudioContext;

    vi.useFakeTimers();
    const { rerender, unmount, container } = render(
      <Sound src="/a.mp3" status="playing" crossfadeMs={50} />,
    );

    vi.useFakeTimers();
    rerender(<Sound src="/b.mp3" status="playing" crossfadeMs={50} />);

    const sourcesBefore = container.querySelectorAll('audio > source');
    expect(sourcesBefore[0].getAttribute('src')).toBe('/a.mp3');
    expect(sourcesBefore[1].getAttribute('src')).toBe('/b.mp3');

    expect(gains.length).toBe(2);
    expect(gains[1].gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
    expect(gains[1].gain.linearRampToValueAtTime).toHaveBeenCalledWith(1, 0.05);
    expect(gains[0].gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, 0.05);
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    const sourcesAfter = container.querySelectorAll('audio > source');
    expect(sourcesAfter[0].getAttribute('src')).toBe('/b.mp3');
    expect(sourcesAfter[1].getAttribute('src')).toBe('/b.mp3');

    unmount();
    window.AudioContext = origAudioContext;
    vi.useRealTimers();
  });

  it('calls play on next and pauses current after crossfade', async () => {
    const gains: Array<{
      gain: {
        setValueAtTime: ReturnType<typeof vi.fn>;
        linearRampToValueAtTime: ReturnType<typeof vi.fn>;
      };
    }> = [];

    const fakeCtx = {
      currentTime: 0,
      resume: vi.fn(),
      close: vi.fn(),
      createMediaElementSource: () => ({
        connect: () => ({ connect: () => fakeCtx }),
        disconnect: vi.fn(),
      }),
      createGain: () => {
        const node = {
          connect: () => fakeCtx,
          disconnect: vi.fn(),
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
          },
        };
        gains.push(node);
        return node;
      },
      destination: {} as AudioDestinationNode,
    } as unknown as AudioContext;

    const origAudioContext = window.AudioContext;
    window.AudioContext = vi.fn(() => fakeCtx) as typeof AudioContext;

    const playMock = window.HTMLMediaElement.prototype
      .play as unknown as ReturnType<typeof vi.fn>;
    const pauseMock = window.HTMLMediaElement.prototype
      .pause as unknown as ReturnType<typeof vi.fn>;
    playMock.mockClear();
    pauseMock.mockClear();

    vi.useFakeTimers();
    const { rerender, unmount } = render(
      <Sound src="/a.mp3" status="playing" crossfadeMs={25} />,
    );

    rerender(<Sound src="/b.mp3" status="playing" crossfadeMs={25} />);

    expect(playMock).toHaveBeenCalled();

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(pauseMock).toHaveBeenCalled();

    unmount();
    window.AudioContext = origAudioContext;
    vi.useRealTimers();
  });
});
