import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { PlayerBar } from '@nuclearplayer/ui';

import { useQueueStore } from '../../stores/queueStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useSoundStore } from '../../stores/soundStore';

export const ConnectedControls: FC = () => {
  const { shuffleEnabled, repeatMode, goToNext, goToPrevious } = useQueueStore(
    useShallow((s) => ({
      shuffleEnabled: s.shuffleEnabled,
      repeatMode: s.repeatMode,
      goToNext: s.goToNext,
      goToPrevious: s.goToPrevious,
    })),
  );
  const { status, toggle } = useSoundStore(
    useShallow((s) => ({
      status: s.status,
      toggle: s.toggle,
    })),
  );
  const setValue = useSettingsStore((s) => s.setValue);

  const handleToggleShuffle = () => {
    setValue('core.playback.shuffle', !shuffleEnabled);
  };

  const handleToggleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setValue('core.playback.repeat', modes[nextIndex]);
  };

  return (
    <PlayerBar.Controls
      isPlaying={status === 'playing'}
      isShuffleActive={shuffleEnabled}
      isRepeatActive={repeatMode !== 'off'}
      onPlayPause={toggle}
      onNext={goToNext}
      onPrevious={goToPrevious}
      onShuffleToggle={handleToggleShuffle}
      onRepeatToggle={handleToggleRepeat}
    />
  );
};
