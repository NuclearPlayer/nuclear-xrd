import { FC, ReactNode } from 'react';

interface PlayerShellProps {
  children: ReactNode;
  className?: string;
}

export const PlayerShell: FC<PlayerShellProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`h-screen w-screen grid grid-rows-[auto_1fr_auto] ${className}`}
    >
      {children}
    </div>
  );
};
