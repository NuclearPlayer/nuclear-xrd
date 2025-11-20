import { act, waitFor } from '@testing-library/react';

import { SoundWrapper } from './Sound.test-wrapper';

describe('Sound component', () => {
  it('mounts app and renders Sound only after src is set', async () => {
    await SoundWrapper.mount();
    expect(document.querySelectorAll('audio').length).toBe(0);

    SoundWrapper.setSrc('/track.mp3');
    await waitFor(() =>
      expect(document.querySelectorAll('audio').length).toBe(2),
    );
  });

  it('plays, seeks, and pauses via store actions', async () => {
    await SoundWrapper.mount();
    SoundWrapper.setSrc('/a.mp3');
    SoundWrapper.play();

    const playMock = window.HTMLMediaElement.prototype
      .play as unknown as ReturnType<typeof vi.fn>;
    const pauseMock = window.HTMLMediaElement.prototype
      .pause as unknown as ReturnType<typeof vi.fn>;

    await waitFor(() => expect(playMock).toHaveBeenCalled());
    playMock.mockClear();
    pauseMock.mockClear();

    SoundWrapper.pause();
    await waitFor(() => expect(pauseMock).toHaveBeenCalled());

    SoundWrapper.play();
    await waitFor(() => expect(playMock).toHaveBeenCalled());

    SoundWrapper.seekTo(37);
    await waitFor(() => {
      const activeAudio = SoundWrapper.getActiveAudio();
      expect(activeAudio).toBeDefined();
      expect(activeAudio?.currentTime).toBe(37);
    });
  });

  it('crossfades on src change when crossfadeMs > 0', async () => {
    await SoundWrapper.mount();
    SoundWrapper.setCrossfadeMs(40);
    SoundWrapper.setSrc('/a.mp3');
    SoundWrapper.play();

    vi.useFakeTimers();
    SoundWrapper.setSrc('/b.mp3');
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });
    vi.useRealTimers();

    const audios = SoundWrapper.getAudios();
    const sources = [...audios].flatMap((a) =>
      [...a.querySelectorAll('source')].map((s) => s.getAttribute('src')),
    );
    expect(sources.every((s) => s === '/b.mp3')).toBe(true);
  });
});
