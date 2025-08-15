import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { FC } from 'react';

import { Button } from '..';
import { cn } from '../../utils';

type PlayerBarControlsProps = {
  isPlaying?: boolean;
  isShuffleActive?: boolean;
  isRepeatActive?: boolean;
  className?: string;
};

export const PlayerBarControls: FC<PlayerBarControlsProps> = ({
  isPlaying = false,
  isShuffleActive = false,
  isRepeatActive = false,
  className = '',
}) => (
  <div className={cn('flex items-center justify-center gap-2', className)}>
    <Button size="icon" variant={isShuffleActive ? 'default' : 'text'}>
      <Shuffle size={16} />
    </Button>
    <Button size="icon" variant="text">
      <SkipBack size={16} />
    </Button>
    <Button size="icon">
      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
    </Button>
    <Button size="icon" variant="text">
      <SkipForward size={16} />
    </Button>
    <Button size="icon" variant={isRepeatActive ? 'default' : 'text'}>
      <Repeat size={16} />
    </Button>
  </div>
);
