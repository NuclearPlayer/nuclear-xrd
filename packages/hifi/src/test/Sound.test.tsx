import { render } from '@testing-library/react';

import { Sound } from '../Sound';
import { setupAudioContextMock } from './test-utils';

describe('Sound', () => {
  it('sets currentTime on the active audio element when seek changes', () => {
    const { restore } = setupAudioContextMock();

    const { rerender } = render(<Sound src="/a.mp3" status="paused" />);

    rerender(<Sound src="/a.mp3" status="paused" seek={42} />);

    const audios = document.querySelectorAll('audio');
    const active = audios[0] as HTMLAudioElement;
    expect(active.currentTime).toBe(42);

    restore();
  });
});
