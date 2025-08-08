import { FC, ReactNode } from 'react';

type BottomBarProps = {
  children?: ReactNode;
  className?: string;
};

export const BottomBar: FC<BottomBarProps> = ({ children, className = '' }) => {
  return (
    <footer
      className={`h-16 bg-background border-t-2 border-border flex items-center px-4 ${className}`}
    >
      {children}
    </footer>
  );
};
