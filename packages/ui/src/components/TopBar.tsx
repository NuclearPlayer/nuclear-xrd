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
        'bg-background-secondary border-border flex h-12 items-center border-b-2 px-4',
        className,
      )}
    >
      <LogoComponent className="inline-flex h-6 w-6" />
      {children}
      <div className="flex-1" />
      <ThemeController />
    </header>
  );
};
