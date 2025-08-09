import { FC, ReactNode } from 'react';

import LogoComponent from '../resources/logotype.svg?react';

type TopBarProps = {
  children?: ReactNode;
  className?: string;
};

export const TopBar: FC<TopBarProps> = ({ children, className = '' }) => {
  return (
    <header
      className={`h-12 bg-background border-b-2 border-border flex items-center px-4 ${className}`}
    >
      <LogoComponent className="inline-flex w-6 h-6" />
      {children}
    </header>
  );
};
