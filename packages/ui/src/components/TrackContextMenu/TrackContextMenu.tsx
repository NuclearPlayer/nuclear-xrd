import { FC, ReactNode } from 'react';

import { TrackContextMenuAction } from './TrackContextMenuAction';
import { TrackContextMenuContent } from './TrackContextMenuContent';
import { TrackContextMenuHeader } from './TrackContextMenuHeader';
import { TrackContextMenuRoot } from './TrackContextMenuRoot';
import { TrackContextMenuSubmenu } from './TrackContextMenuSubmenu';
import { TrackContextMenuTrigger } from './TrackContextMenuTrigger';

type TrackContextMenuProps = {
  children: ReactNode;
  className?: string;
};

type TrackContextMenuComponent = FC<TrackContextMenuProps> & {
  Trigger: typeof TrackContextMenuTrigger;
  Content: typeof TrackContextMenuContent;
  Header: typeof TrackContextMenuHeader;
  Action: typeof TrackContextMenuAction;
  Submenu: typeof TrackContextMenuSubmenu;
};

const TrackContextMenuImpl: FC<TrackContextMenuProps> = ({
  children,
  className,
}) => {
  return (
    <TrackContextMenuRoot className={className}>
      {children}
    </TrackContextMenuRoot>
  );
};

export const TrackContextMenu =
  TrackContextMenuImpl as TrackContextMenuComponent;
TrackContextMenu.Trigger = TrackContextMenuTrigger;
TrackContextMenu.Content = TrackContextMenuContent;
TrackContextMenu.Header = TrackContextMenuHeader;
TrackContextMenu.Action = TrackContextMenuAction;
TrackContextMenu.Submenu = TrackContextMenuSubmenu;
