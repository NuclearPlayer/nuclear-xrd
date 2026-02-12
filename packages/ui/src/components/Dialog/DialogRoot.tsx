import {
  DialogBackdrop,
  DialogPanel,
  Dialog as HeadlessDialog,
} from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import React, { FC, PropsWithChildren } from 'react';

import { Button } from '../Button';
import { DialogContext } from './context';

type DialogRootProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  initialFocus?: React.RefObject<HTMLElement | null>;
}>;

export const DialogRoot: FC<DialogRootProps> = ({
  isOpen,
  onClose,
  initialFocus,
  children,
}) => {
  return (
    <DialogContext.Provider value={{ onClose }}>
      <AnimatePresence>
        {isOpen && (
          <HeadlessDialog
            static
            open={isOpen}
            onClose={onClose}
            initialFocus={initialFocus}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            </motion.div>
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
                <DialogPanel className="border-border bg-background shadow-shadow relative w-full max-w-md rounded-md border-2 p-6">
                  <Button
                    variant="text"
                    size="icon-sm"
                    onClick={onClose}
                    className="absolute top-3 right-3"
                    aria-label="Close"
                    data-testid="dialog-x-close"
                  >
                    <XIcon size={16} />
                  </Button>
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
