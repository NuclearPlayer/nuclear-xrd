import { act, render } from '@testing-library/react';

import { CrossfadeSound } from '../CrossfadeSound';
import { resetMediaSpies, setupAudioContextMock } from './test-utils';

describe('CrossfadeSound', () => {
  it('ramps gains and flips active index after crossfade', async () => {
    const { gains, restore } = setupAudioContextMock();

    vi.useFakeTimers();
    const { rerender, unmount, container } = render(
      <CrossfadeSound src="/a.mp3" status="playing" crossfadeMs={50} />,
    );

    rerender(<CrossfadeSound src="/b.mp3" status="playing" crossfadeMs={50} />);

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
    restore();
    vi.useRealTimers();
  });

  it('calls play on next and pauses current after crossfade', async () => {
    const { restore } = setupAudioContextMock();
    const { playMock, pauseMock } = resetMediaSpies();

    vi.useFakeTimers();
    const { rerender, unmount } = render(
      <CrossfadeSound src="/a.mp3" status="playing" crossfadeMs={25} />,
    );

    rerender(<CrossfadeSound src="/b.mp3" status="playing" crossfadeMs={25} />);

    expect(playMock).toHaveBeenCalled();

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(pauseMock).toHaveBeenCalled();

    unmount();
    restore();
    vi.useRealTimers();
  });
});
