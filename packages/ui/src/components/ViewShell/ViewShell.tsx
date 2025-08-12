import { FC, ReactNode } from 'react';

type ViewShellProps = {
  children: ReactNode;
  title: string;
};

export const ViewShell: FC<ViewShellProps> = ({ children, title }) => {
  return (
    <div className="relative flex h-full w-full flex-col items-start justify-start px-6 pt-6">
      <h1 className="flex w-full flex-0 flex-row text-center text-3xl font-bold">
        {title}
      </h1>
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};
