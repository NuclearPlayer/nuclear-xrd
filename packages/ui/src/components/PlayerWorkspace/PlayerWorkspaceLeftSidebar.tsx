import { FC } from 'react';

import {
  PlayerWorkspaceSidebar,
  PlayerWorkspaceSidebarPropsBase,
} from './PlayerWorkspaceSidebar';

export const PlayerWorkspaceLeftSidebar: FC<
  PlayerWorkspaceSidebarPropsBase
> = ({ children, ...props }) => {
  return (
    <PlayerWorkspaceSidebar side="left" {...props}>
      {children}
    </PlayerWorkspaceSidebar>
  );
};
