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
            'flex w-full cursor-pointer items-center gap-3 border-t border-transparent px-3 py-2 text-sm not-last:border-b',
            {
              'bg-background-secondary border-border inset-2 nth-[2]:border-t-transparent':
                focus,
            },
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
