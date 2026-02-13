import { render } from '@testing-library/react';

import { Sound } from '../Sound';
import { AudioSource } from '../types';
import { setupAudioContextMock } from './test-utils';

const hlsSource: AudioSource = {
  url: 'https://example.com/stream.m3u8',
  protocol: 'hls',
};

const httpSource: AudioSource = { url: '/a.mp3', protocol: 'http' };

describe('useHlsSource', () => {
  it('sets audio.src directly when native HLS is supported', () => {
    const { restore } = setupAudioContextMock();
    const canPlayTypeSpy = vi
      .spyOn(HTMLAudioElement.prototype, 'canPlayType')
      .mockImplementation((type: string) =>
        type === 'application/vnd.apple.mpegurl' ? 'probably' : '',
      );

    render(<Sound src={hlsSource} status="playing" />);

    const audio = document.querySelector('audio') as HTMLAudioElement;
    expect(audio.src).toContain('stream.m3u8');

    canPlayTypeSpy.mockRestore();
    restore();
  });

  it('does not interfere with non-HLS sources', () => {
    const { restore } = setupAudioContextMock();

    render(<Sound src={httpSource} status="playing" />);

    const audio = document.querySelector('audio') as HTMLAudioElement;
    expect(audio.src).not.toContain('m3u8');

    restore();
  });
});
