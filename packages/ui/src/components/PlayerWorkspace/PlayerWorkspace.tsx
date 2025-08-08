import clsx from 'clsx';
import { FC, ReactNode } from 'react';

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
    <main className={clsx('bg-background-secondary overflow-auto', className)}>
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
        className={`grid grid-cols-[auto_1fr_auto] h-full bg-background-secondary ${className}`}
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
