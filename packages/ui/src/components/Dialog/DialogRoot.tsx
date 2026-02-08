import {
  DialogBackdrop,
  DialogPanel,
  Dialog as HeadlessDialog,
} from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, PropsWithChildren } from 'react';

import { DialogContext } from './context';

type DialogRootProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
}>;

export const DialogRoot: FC<DialogRootProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <DialogContext.Provider value={{ onClose }}>
      <AnimatePresence>
        {open && (
          <HeadlessDialog
            static
            open={open}
            onClose={onClose}
            className="relative z-50"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 22,
                  mass: 0.9,
                }}
              >
                <DialogPanel className="border-border bg-primary shadow-shadow w-full max-w-md rounded-md border-2 p-6">
                  {children}
                </DialogPanel>
              </motion.div>
            </div>
          </HeadlessDialog>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};
