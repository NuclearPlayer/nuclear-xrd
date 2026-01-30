import { MenuButton } from '@headlessui/react';
import { FC, ReactNode } from 'react';

type TrackContextMenuTriggerProps = {
  children: ReactNode;
};

export const TrackContextMenuTrigger: FC<TrackContextMenuTriggerProps> = ({
  children,
}) => {
  return (
    <MenuButton as="div" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      {children}
    </MenuButton>
  );
};
