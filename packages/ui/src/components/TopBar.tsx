import { FC, ReactNode } from 'react';

type TopBarProps = {
  children?: ReactNode;
  className?: string;
};

export const TopBar: FC<TopBarProps> = ({ children, className = '' }) => {
  return (
    <header
      className={`h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4 ${className}`}
    >
      {children}
    </header>
  );
};
