import { FC, ReactNode } from 'react';

type SidebarNavigationItemProps = {
  children: ReactNode;
  isSelected?: boolean;
  isCollapsed?: boolean;
};
export const SidebarNavigationItem: FC<SidebarNavigationItemProps> = ({
  children,
}) => {
  return (
    <div className="flex flex-row items-center justify-start gap-2 px-2">
      {children}
    </div>
  );
};
