import { Menu } from '@headlessui/react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type TrackContextMenuRootProps = {
  children: ReactNode;
  className?: string;
};

export const TrackContextMenuRoot: FC<TrackContextMenuRootProps> = ({
  children,
  className,
}) => {
  return (
    <Menu as="div" className={cn('relative', className)}>
      {children}
    </Menu>
  );
};
