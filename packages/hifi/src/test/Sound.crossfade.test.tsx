import { act, render } from '@testing-library/react';

import { Sound } from '../Sound';

describe('Sound crossfade', () => {
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
});
