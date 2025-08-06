import { FC, ReactNode } from 'react';

interface BottomBarProps {
  children?: ReactNode;
  className?: string;
}

export const BottomBar: FC<BottomBarProps> = ({ children, className = '' }) => {
  return (
    <footer
      className={`h-16 bg-gray-900 border-t border-gray-700 flex items-center px-4 ${className}`}
    >
      {children}
    </footer>
  );
};
