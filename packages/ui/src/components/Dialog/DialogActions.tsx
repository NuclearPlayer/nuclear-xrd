import { FC, PropsWithChildren } from 'react';

export const DialogActions: FC<PropsWithChildren> = ({ children }) => (
  <div className="mt-6 flex justify-end gap-3">{children}</div>
);
