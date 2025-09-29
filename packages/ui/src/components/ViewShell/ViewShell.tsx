import { FC, ReactNode } from 'react';

type ViewShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  'data-testid'?: string;
};

export const ViewShell: FC<ViewShellProps> = ({
  children,
  title,
  subtitle,
  'data-testid': dataTestId,
}) => (
  <div
    className="bg-background relative flex h-full w-full flex-col items-start justify-start px-6 pt-6"
    data-testid={dataTestId}
  >
    <h1 className="mb-6 flex w-full flex-0 flex-row text-center text-3xl font-bold">
      {title}
    </h1>
    {subtitle && (
      <h2 className="mb-4 flex w-full flex-0 flex-row text-center text-xl font-semibold">
        {subtitle}
      </h2>
    )}
    <div className="flex w-full flex-1 flex-col overflow-hidden">
      {children}
    </div>
  </div>
);
