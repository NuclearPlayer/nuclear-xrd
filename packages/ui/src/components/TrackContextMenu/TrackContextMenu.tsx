import { FC, ReactNode } from 'react';

import { TrackContextMenuAction } from './TrackContextMenuAction';
import { TrackContextMenuContent } from './TrackContextMenuContent';
import { TrackContextMenuHeader } from './TrackContextMenuHeader';
import { TrackContextMenuRoot } from './TrackContextMenuRoot';
import {
  TrackContextMenuSubmenu,
  TrackContextMenuSubmenuContent,
  TrackContextMenuSubmenuTrigger,
} from './TrackContextMenuSubmenu';
import { TrackContextMenuTrigger } from './TrackContextMenuTrigger';

type TrackContextMenuProps = {
  children: ReactNode;
};

type SubmenuComponent = typeof TrackContextMenuSubmenu & {
  Trigger: typeof TrackContextMenuSubmenuTrigger;
  Content: typeof TrackContextMenuSubmenuContent;
};

type TrackContextMenuComponent = FC<TrackContextMenuProps> & {
  Trigger: typeof TrackContextMenuTrigger;
  Content: typeof TrackContextMenuContent;
  Header: typeof TrackContextMenuHeader;
  Action: typeof TrackContextMenuAction;
  Submenu: SubmenuComponent;
};

const TrackContextMenuImpl: FC<TrackContextMenuProps> = ({ children }) => {
  return <TrackContextMenuRoot>{children}</TrackContextMenuRoot>;
};

export const TrackContextMenu =
  TrackContextMenuImpl as TrackContextMenuComponent;
TrackContextMenu.Trigger = TrackContextMenuTrigger;
TrackContextMenu.Content = TrackContextMenuContent;
TrackContextMenu.Header = TrackContextMenuHeader;
TrackContextMenu.Action = TrackContextMenuAction;
TrackContextMenu.Submenu = TrackContextMenuSubmenu as SubmenuComponent;
TrackContextMenu.Submenu.Trigger = TrackContextMenuSubmenuTrigger;
TrackContextMenu.Submenu.Content = TrackContextMenuSubmenuContent;
