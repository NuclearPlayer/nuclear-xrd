import { FC } from 'react';

import { PlayerBarControls } from './PlayerBarControls';
import { PlayerBarNowPlaying } from './PlayerBarNowPlaying';
import { PlayerBarRoot, PlayerBarRootProps } from './PlayerBarRoot';
import { PlayerBarVolume } from './PlayerBarVolume';

type PlayerBarProps = PlayerBarRootProps;

type PlayerBarComponent = FC<PlayerBarProps> & {
  NowPlaying: typeof PlayerBarNowPlaying;
  Controls: typeof PlayerBarControls;
  Volume: typeof PlayerBarVolume;
};

const PlayerBarImpl: FC<PlayerBarProps> = ({
  left,
  center,
  right,
  className = '',
}) => {
  return (
    <PlayerBarRoot
      className={className}
      left={left}
      center={center}
      right={right}
    />
  );
};

export const PlayerBar = PlayerBarImpl as PlayerBarComponent;
PlayerBar.NowPlaying = PlayerBarNowPlaying;
PlayerBar.Controls = PlayerBarControls;
PlayerBar.Volume = PlayerBarVolume;
