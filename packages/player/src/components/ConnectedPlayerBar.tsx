import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { PlayerBar } from '@nuclearplayer/ui';

import { useQueueStore } from '../stores/queue/queue.store';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';

export const ConnectedPlayerBar: FC = () => {
  const { t } = useTranslation('playerBar');
  const { getCurrentItem, shuffleEnabled, repeatMode, goToNext, goToPrevious } =
    useQueueStore(
      useShallow((s) => ({
        getCurrentItem: s.getCurrentItem,
        shuffleEnabled: s.shuffleEnabled,
        repeatMode: s.repeatMode,
        goToNext: s.goToNext,
        goToPrevious: s.goToPrevious,
      })),
    );
  const { status, seek, duration, toggle, seekTo } = useSoundStore(
    useShallow((s) => ({
      status: s.status,
      seek: s.seek,
      duration: s.duration,
      toggle: s.toggle,
      seekTo: s.seekTo,
    })),
  );
  const { getValue, setValue } = useSettingsStore(
    useShallow((s) => ({
      getValue: s.getValue,
      setValue: s.setValue,
    })),
  );
  const currentItem = getCurrentItem();
  const volume = (getValue('core.playback.volume') as number) ?? 1;

  const track = currentItem?.track;

  const nowPlayingInfo = useMemo(() => {
    const artwork = pickArtwork(track?.album?.artwork, 'thumbnail', 64);
    return {
      title: track?.title ?? t('noTrackPlaying'),
      artist: track?.artists[0]?.name ?? '',
      coverUrl: artwork?.url,
    };
  }, [track, t]);

  const seekBarInfo = useMemo(() => {
    const safePosition = Number.isFinite(seek) ? seek : 0;
    const safeDuration = Number.isFinite(duration) ? duration : 0;
    const progress = safeDuration > 0 ? (safePosition / safeDuration) * 100 : 0;
    const remaining = safeDuration - safePosition;

    return {
      progress,
      elapsedSeconds: safePosition,
      remainingSeconds: remaining,
      isLoading: currentItem?.status === 'loading',
    };
  }, [seek, duration, currentItem?.status]);

  const handleSeek = useCallback(
    (percent: number) => {
      if (duration > 0) {
        const seekTime = (percent / 100) * duration;
        seekTo(seekTime);
      }
    },
    [duration, seekTo],
  );

  const handleVolumeChange = useCallback(
    (value: number) => {
      setValue('core.playback.volume', value / 100);
    },
    [setValue],
  );

  const handleToggleShuffle = useCallback(() => {
    setValue('core.playback.shuffle', !shuffleEnabled);
  }, [shuffleEnabled, setValue]);

  const handleToggleRepeat = useCallback(() => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setValue('core.playback.repeat', modes[nextIndex]);
  }, [repeatMode, setValue]);

  return (
    <>
      <PlayerBar.SeekBar
        progress={seekBarInfo.progress}
        elapsedSeconds={seekBarInfo.elapsedSeconds}
        remainingSeconds={seekBarInfo.remainingSeconds}
        isLoading={seekBarInfo.isLoading}
        onSeek={handleSeek}
      />
      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title={nowPlayingInfo.title}
            artist={nowPlayingInfo.artist}
            coverUrl={nowPlayingInfo.coverUrl}
          />
        }
        center={
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
        }
        right={
          <PlayerBar.Volume
            value={Math.round(volume * 100)}
            onValueChange={handleVolumeChange}
          />
        }
      />
    </>
  );
};
