import { FC } from 'react';

import { PlayerBar } from '@nuclearplayer/ui';

import { useSettingsStore } from '../../stores/settingsStore';

export const ConnectedVolume: FC = () => {
  const getValue = useSettingsStore((s) => s.getValue);
  const setValue = useSettingsStore((s) => s.setValue);

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
