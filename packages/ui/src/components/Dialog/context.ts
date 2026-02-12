import { createContext, useContext } from 'react';

type DialogContextValue = {
  onClose: () => void;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialogContext = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error('Dialog.* must be used within <Dialog.Root>');
  }
  return ctx;
};
