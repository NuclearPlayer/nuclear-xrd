import { FC, ReactNode } from 'react';

import { cn } from '../utils';

type PlayerShellProps = {
  children: ReactNode;
  className?: string;
};

export const PlayerShell: FC<PlayerShellProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'grid h-screen w-screen grid-rows-[auto_1fr_auto] overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  );
};
