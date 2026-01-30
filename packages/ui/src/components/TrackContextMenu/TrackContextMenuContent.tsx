import { MenuItems } from '@headlessui/react';
import { FC, ReactNode } from 'react';

type TrackContextMenuContentProps = {
  children: ReactNode;
};

export const TrackContextMenuContent: FC<TrackContextMenuContentProps> = ({
  children,
}) => {
  return (
    <MenuItems
      anchor="bottom end"
      className="bg-background border-border z-50 w-56 origin-top-right rounded-sm border-2 p-1 shadow-lg focus:outline-none"
    >
      {children}
    </MenuItems>
  );
};
