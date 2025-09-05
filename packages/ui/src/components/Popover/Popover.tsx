import {
  Popover as HeadlessPopover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
  PopoverPanelProps,
} from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '../../utils';

export type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  anchor?: PopoverPanelProps['anchor'];
  backdrop?: boolean;
};

export const Popover = ({
  trigger,
  children,
  className,
  anchor,
  backdrop,
}: PopoverProps) => {
  return (
    <HeadlessPopover className={cn('absolute', className)}>
      {({ open }) => (
        <>
          <PopoverButton className="cursor-pointer">{trigger}</PopoverButton>
          <AnimatePresence>
            {open && (
              <>
                {backdrop && (
                  <PopoverBackdrop
                    transition
                    className="fixed inset-0 bg-black/20 transition duration-150 ease-out data-closed:opacity-0"
                  />
                )}
                <PopoverPanel
                  static
                  as={motion.div}
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  className={cn(
                    'text-foreground bg-primary border-border rounded border-2 px-4 py-2 leading-5 select-none',
                    {
                      ['translate-y-0']: anchor === 'bottom',
                      ['-translate-y-4']: anchor === 'top',
                      ['translate-x-2 -translate-y-2']: anchor === 'right',
                      ['-translate-x-2 -translate-y-2']: anchor === 'left',
                    },
                  )}
                  anchor={anchor}
                >
                  {children}
                </PopoverPanel>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </HeadlessPopover>
  );
};
