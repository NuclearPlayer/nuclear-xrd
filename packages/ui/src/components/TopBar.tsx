import { FC, ReactNode } from 'react';

import LogoComponent from '../resources/logotype.svg?react';
import { cn } from '../utils';
import { ThemeController } from './ThemeController';

type TopBarProps = {
  children?: ReactNode;
  className?: string;
};

export const TopBar: FC<TopBarProps> = ({ children, className = '' }) => {
  return (
    <header
      className={cn(
        'h-12 bg-background border-b-2 border-border flex items-center px-4',
        className,
      )}
    >
      <LogoComponent className="inline-flex w-6 h-6" />
      {children}
      <div className="flex-1" />
      <ThemeController />
    </header>
  );
};
