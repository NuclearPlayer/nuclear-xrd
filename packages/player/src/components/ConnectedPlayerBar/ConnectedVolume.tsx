import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { PlayerBar } from '@nuclearplayer/ui';

import { useSettingsStore } from '../../stores/settingsStore';

export const ConnectedVolume: FC = () => {
  const { getValue, setValue } = useSettingsStore(
    useShallow((s) => ({
      getValue: s.getValue,
      setValue: s.setValue,
    })),
  );

  const volume = (getValue('core.playback.volume') as number) ?? 1;

  const handleVolumeChange = (value: number) => {
    setValue('core.playback.volume', value / 100);
  };

  return (
    <PlayerBar.Volume
      value={Math.round(volume * 100)}
      onValueChange={handleVolumeChange}
    />
  );
};
