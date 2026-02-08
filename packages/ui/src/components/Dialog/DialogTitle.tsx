import { DialogTitle as HeadlessDialogTitle } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';

export const DialogTitle: FC<PropsWithChildren> = ({ children }) => (
  <HeadlessDialogTitle className="text-foreground text-lg font-bold">
    {children}
  </HeadlessDialogTitle>
);
