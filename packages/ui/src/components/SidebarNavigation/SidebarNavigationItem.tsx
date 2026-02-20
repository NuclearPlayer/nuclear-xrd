import { Link } from '@tanstack/react-router';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type SidebarNavigationItemProps = {
  children: ReactNode;
  isSelected?: boolean;
  isCollapsed?: boolean;
  to?: string;
};

const ItemContent: FC<{ children: ReactNode; isSelected?: boolean }> = ({
  children,
  isSelected,
}) => (
  <div
    data-testid="sidebar-navigation-item"
    className={cn(
      'flex w-full flex-row items-center justify-start gap-2 rounded-r-md border-y-2 border-transparent px-2 py-1',
      isSelected &&
        'bg-primary border-border border-t-2 border-r-2 border-b-2 font-bold',
    )}
  >
    {children}
  </div>
);

export const SidebarNavigationItem: FC<SidebarNavigationItemProps> = ({
  children,
  isSelected,
  to,
}) => {
  if (to) {
    return (
      <Link to={to}>
        {({ isActive }) => (
          <ItemContent isSelected={isActive}>{children}</ItemContent>
        )}
      </Link>
    );
  }

  return <ItemContent isSelected={isSelected}>{children}</ItemContent>;
};
