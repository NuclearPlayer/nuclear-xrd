import { FC, ReactNode } from 'react';

import { cn } from '../utils';

type BottomBarProps = {
  children?: ReactNode;
  className?: string;
};

export const BottomBar: FC<BottomBarProps> = ({ children, className = '' }) => {
  return (
    <footer
      className={cn(
        'h-16 bg-background border-t-2 border-border flex items-center px-4',
        className,
      )}
    >
      {children}
    </footer>
  );
};
