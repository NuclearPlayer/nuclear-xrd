import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC, ReactNode } from 'react';

type TrackContextMenuTriggerProps = {
  children: ReactNode;
};

export const TrackContextMenuTrigger: FC<TrackContextMenuTriggerProps> = ({
  children,
}) => {
  return (
    <DropdownMenu.Trigger asChild onClick={(e) => e.stopPropagation()}>
      <div>{children}</div>
    </DropdownMenu.Trigger>
  );
};
