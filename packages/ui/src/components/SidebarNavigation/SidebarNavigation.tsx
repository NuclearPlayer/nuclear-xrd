import { FC, ReactElement } from 'react';

import { SidebarNavigationCollapsible } from './SidebarNavigationCollapsible';
import { SidebarNavigationItem } from './SidebarNavigationItem';

type SidebarNavigationProps = {
  children:
    | ReactElement<typeof SidebarNavigationItem>
    | ReactElement<typeof SidebarNavigationCollapsible>
    | Array<ReactElement<typeof SidebarNavigationItem>>
    | Array<ReactElement<typeof SidebarNavigationCollapsible>>;
  isCollapsed?: boolean;
};

export const SidebarNavigation: FC<SidebarNavigationProps> = ({ children }) => {
  return (
    <div className="flex flex-col justify-start items-start flex-1">
      {children}
    </div>
  );
};
