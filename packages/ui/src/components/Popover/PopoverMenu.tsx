import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

type PopoverMenuProps = ComponentProps<'div'>;

export const PopoverMenu: FC<PopoverMenuProps> = ({ className, ...props }) => (
  <div
    className={cn('flex min-w-48 flex-col overflow-hidden', className)}
    {...props}
  />
);
