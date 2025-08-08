import { FC, ReactNode } from 'react';

type SidebarNavigationItemProps = {
  children: ReactNode;
  isSelected?: boolean;
  isCollapsed?: boolean;
};
export const SidebarNavigationItem: FC<SidebarNavigationItemProps> = ({
  children,
}) => {
  return <div>{children}</div>;
};
