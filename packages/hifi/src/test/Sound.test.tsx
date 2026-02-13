import { render } from '@testing-library/react';

import { Sound } from '../Sound';
import { AudioSource } from '../types';
import { setupAudioContextMock } from './test-utils';

const httpSource: AudioSource = { url: '/a.mp3', protocol: 'http' };

describe('Sound', () => {
  it('sets currentTime on the active audio element when seek changes', () => {
    const { restore } = setupAudioContextMock();

    const { rerender } = render(<Sound src={httpSource} status="paused" />);

    rerender(<Sound src={httpSource} status="paused" seek={42} />);

    const audios = document.querySelectorAll('audio');
    const active = audios[0] as HTMLAudioElement;
    expect(active.currentTime).toBe(42);

    restore();
  });
});
