import { Music2 } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';

type PlayerBarNowPlayingProps = {
  title: string;
  artist: string;
  coverUrl?: string;
  className?: string;
};

export const PlayerBarNowPlaying: FC<PlayerBarNowPlayingProps> = ({
  title,
  artist,
  coverUrl,
  className = '',
}) => {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <div className="border-border bg-background-secondary size-12 shrink-0 overflow-hidden rounded border-2">
        {coverUrl ? (
          <img src={coverUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="text-foreground-secondary flex size-full items-center justify-center">
            <Music2 size={20} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-foreground truncate text-sm font-bold">
          {title}
        </div>
        <div className="text-foreground-secondary truncate text-xs">
          {artist}
        </div>
      </div>
    </div>
  );
};
