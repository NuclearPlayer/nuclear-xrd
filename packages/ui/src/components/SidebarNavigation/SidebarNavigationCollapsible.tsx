import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';

import { Button } from '../Button/Button';

type SidebarNavigationCollapsibleProps = {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
};
export const SidebarNavigationCollapsible: FC<
  SidebarNavigationCollapsibleProps
> = ({ children, title, icon }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div className={clsx('flex flex-col gap-2 w-full')}>
      <Button
        variant="text"
        className="inline-flex flex-row items-center justify-between"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {icon}
        {title}
        <ChevronRight
          className={clsx({
            'rotate-90': !isCollapsed,
          })}
        />
      </Button>
      {!isCollapsed && children}
    </div>
  );
};
