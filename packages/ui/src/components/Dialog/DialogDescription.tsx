import { Description } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';

export const DialogDescription: FC<PropsWithChildren> = ({ children }) => (
  <Description className="text-foreground-secondary mt-2 text-sm">
    {children}
  </Description>
);
