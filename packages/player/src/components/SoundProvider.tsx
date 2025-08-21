import type { FC, PropsWithChildren } from 'react';

import { Sound } from '@nuclearplayer/hifi';

import { useSoundState } from '../hooks/useSound';

export const SoundProvider: FC<PropsWithChildren> = ({ children }) => {
  const { src, status, seek, crossfadeMs, preload, crossOrigin } =
    useSoundState();

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
