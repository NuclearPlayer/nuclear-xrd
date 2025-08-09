import { FC, ReactNode } from 'react';

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
      className={`h-screen w-screen overflow-hidden grid grid-rows-[auto_1fr_auto] ${className}`}
    >
      {children}
    </div>
  );
};
