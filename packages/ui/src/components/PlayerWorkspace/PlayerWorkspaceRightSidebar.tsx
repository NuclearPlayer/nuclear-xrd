import { FC } from 'react';

import {
  PlayerWorkspaceSidebar,
  PlayerWorkspaceSidebarPropsBase,
} from './PlayerWorkspaceSidebar';

export const PlayerWorkspaceRightSidebar: FC<
  PlayerWorkspaceSidebarPropsBase
> = ({ children, ...props }) => {
  return (
    <PlayerWorkspaceSidebar side="right" {...props}>
      {children}
    </PlayerWorkspaceSidebar>
  );
};
