import { FC, PropsWithChildren } from 'react';

export const TextHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <th role="columnheader" className="px-2 text-left">
      {children}
    </th>
  );
};
