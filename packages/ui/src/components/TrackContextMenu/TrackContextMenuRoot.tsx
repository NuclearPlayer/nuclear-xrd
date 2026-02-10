import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC, ReactNode } from 'react';

type TrackContextMenuRootProps = {
  children: ReactNode;
};

export const TrackContextMenuRoot: FC<TrackContextMenuRootProps> = ({
  children,
}) => {
  return <DropdownMenu.Root>{children}</DropdownMenu.Root>;
};
