import { FC, ReactNode } from 'react';

type TopBarProps = {
  children?: ReactNode;
  className?: string;
};

export const TopBar: FC<TopBarProps> = ({ children, className = '' }) => {
  return (
    <header
      className={`h-12 bg-background border-b-2 border-border flex items-center px-4 ${className}`}
    >
      {children}
    </header>
  );
};
