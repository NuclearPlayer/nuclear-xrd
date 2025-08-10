import { FC, ReactNode } from 'react';

type ViewShellProps = {
  children: ReactNode;
  title: string;
};

export const ViewShell: FC<ViewShellProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col items-start justify-start w-full h-full p-6">
      <h1 className="text-3xl font-bold text-center">{title}</h1>
      {children}
    </div>
  );
};
