import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { PlayerWorkspaceLeftSidebar } from './PlayerWorkspaceLeftSidebar';
import { PlayerWorkspaceRightSidebar } from './PlayerWorkspaceRightSidebar';

type PlayerWorkspaceProps = {
  children: ReactNode;
  className?: string;
};

type MainProps = {
  children?: ReactNode;
  className?: string;
};

const PlayerWorkspaceMain: FC<MainProps> = ({ children, className = '' }) => {
  return (
    <main
      data-testid="player-workspace-main"
      className={cn('bg-background-secondary overflow-auto', className)}
    >
      {children}
    </main>
  );
};

type PlayerWorkspaceComponent = FC<PlayerWorkspaceProps> & {
  LeftSidebar: typeof PlayerWorkspaceLeftSidebar;
  RightSidebar: typeof PlayerWorkspaceRightSidebar;
  Main: typeof PlayerWorkspaceMain;
};

export const PlayerWorkspace: PlayerWorkspaceComponent = Object.assign(
  ({ children, className = '' }: PlayerWorkspaceProps) => {
    return (
      <div
        className={cn(
          'grid h-full min-h-0 grid-cols-[auto_1fr_auto] bg-background-secondary relative',
          className,
        )}
      >
        {children}
      </div>
    );
  },
  {
    LeftSidebar: PlayerWorkspaceLeftSidebar,
    RightSidebar: PlayerWorkspaceRightSidebar,
    Main: PlayerWorkspaceMain,
  },
);
