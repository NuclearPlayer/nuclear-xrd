import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type CardGridProps = {
  children?: ReactNode;
  className?: string;
};

export const CardGrid: FC<CardGridProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4',
        className,
      )}
      role="grid"
    >
      {children}
    </div>
  );
};
