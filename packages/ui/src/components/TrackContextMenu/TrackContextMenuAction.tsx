import { MenuItem } from '@headlessui/react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type TrackContextMenuActionProps = {
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
};

export const TrackContextMenuAction: FC<TrackContextMenuActionProps> = ({
  icon,
  children,
  onClick,
}) => {
  return (
    <MenuItem>
      {({ focus }) => (
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded px-3 py-2 text-sm',
            focus && 'bg-background-secondary',
          )}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {icon}
          {children}
        </button>
      )}
    </MenuItem>
  );
};
