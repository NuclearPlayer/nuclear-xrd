import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { Sound, Volume } from '@nuclearplayer/hifi';

import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';

export const SoundProvider: FC<PropsWithChildren> = ({ children }) => {
  const { src, status, seek } = useSoundStore();
  const getValue = useSettingsStore((s) => s.getValue);
  const crossfadeMs = getValue('core.playback.crossfadeMs') as number;
  const preload: 'none' | 'metadata' | 'auto' = 'auto';
  const crossOrigin: '' | 'anonymous' | 'use-credentials' = '';
  const volume01 = (getValue('core.playback.volume') as number) ?? 1;
  const muted = (getValue('core.playback.muted') as boolean) ?? false;
  const volumePercent = muted ? 0 : Math.round(volume01 * 100);

  useEffect(() => {
    const { setCrossfadeMs } = useSoundStore.getState();
    setCrossfadeMs(crossfadeMs);
  }, [crossfadeMs]);

  return (
    <>
      {src && (
        <Sound
          src={src}
          status={status}
          seek={seek}
          crossfadeMs={crossfadeMs}
          preload={preload}
          crossOrigin={crossOrigin}
        >
          <Volume value={volumePercent} />
        </Sound>
      )}
      {children}
    </>
  );
};
