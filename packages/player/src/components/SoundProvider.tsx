import type { FC, PropsWithChildren } from 'react';

import { Sound } from '@nuclearplayer/hifi';

import { useSoundStore } from '../stores/soundStore';

export const SoundProvider: FC<PropsWithChildren> = ({ children }) => {
  const { src, status, seek, crossfadeMs, preload, crossOrigin } =
    useSoundStore();

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
        />
      )}
      {children}
    </>
  );
};
