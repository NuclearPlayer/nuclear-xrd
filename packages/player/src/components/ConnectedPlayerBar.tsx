import type { FC } from 'react';
import { useCallback, useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { pickArtwork } from '@nuclearplayer/model';
import { PlayerBar } from '@nuclearplayer/ui';

import { useQueueStore } from '../stores/queue/queue.store';
import { useSettingsStore } from '../stores/settingsStore';
import { useSoundStore } from '../stores/soundStore';

export const ConnectedPlayerBar: FC = () => {
  const { t } = useTranslation('playerBar');
  const queueStore = useQueueStore();
  const soundStore = useSoundStore();
  const settingsStore = useSettingsStore();
  const currentItem = queueStore.getCurrentItem();
  const volume =
    (settingsStore.getValue('core.playback.volume') as number) ?? 1;

  const track = currentItem?.track;

  const nowPlayingInfo = useMemo(() => {
    const artwork = pickArtwork(track?.album?.artwork, 'thumbnail', 64);
    return {
      title: track?.title ?? t('noTrackPlaying'),
      artist: track?.artists[0]?.name ?? '',
      coverUrl: artwork?.url,
    };
  }, [track]);

  const seekBarInfo = useMemo(() => {
    const safePosition = Number.isFinite(soundStore.seek) ? soundStore.seek : 0;
    const safeDuration = Number.isFinite(soundStore.duration)
      ? soundStore.duration
      : 0;
    const progress = safeDuration > 0 ? (safePosition / safeDuration) * 100 : 0;
    const remaining = safeDuration - safePosition;

    return {
      progress,
      elapsedSeconds: safePosition,
      remainingSeconds: remaining,
      isLoading: currentItem?.status === 'loading',
    };
  }, [soundStore.seek, soundStore.duration, currentItem?.status]);

  const handleSeek = useCallback(
    (percent: number) => {
      if (soundStore.duration > 0) {
        const seekTime = (percent / 100) * soundStore.duration;
        soundStore.seekTo(seekTime);
      }
    },
    [soundStore.duration, soundStore.seekTo],
  );

  const handleVolumeChange = useCallback(
    (value: number) => {
      settingsStore.setValue('core.playback.volume', value / 100);
    },
    [settingsStore.setValue],
  );

  const handleToggleShuffle = useCallback(() => {
    settingsStore.setValue('core.playback.shuffle', !queueStore.shuffleEnabled);
  }, [queueStore.shuffleEnabled, settingsStore.setValue]);

  const handleToggleRepeat = useCallback(() => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(queueStore.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    settingsStore.setValue('core.playback.repeat', modes[nextIndex]);
  }, [queueStore.repeatMode, settingsStore.setValue]);

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
            isShuffleActive={queueStore.shuffleEnabled}
            isRepeatActive={queueStore.repeatMode !== 'off'}
            onPlayPause={soundStore.toggle}
            onNext={queueStore.goToNext}
            onPrevious={queueStore.goToPrevious}
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
