import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type SectionShellProps = {
  children: ReactNode;
  title: string;
  className?: string;
  'data-testid'?: string;
};

export const SectionShell: FC<SectionShellProps> = ({
  children,
  title,
  className,
  'data-testid': dataTestId,
}) => (
  <section
    data-testid={dataTestId}
    className={cn(
      'mb-6 flex w-full flex-col items-start justify-start',
      className,
    )}
  >
    <h2 className="mb-3 flex w-full flex-0 flex-row text-left text-2xl font-bold">
      {title}
    </h2>
    <div className="flex w-full flex-1 flex-col">{children}</div>
  </section>
);
