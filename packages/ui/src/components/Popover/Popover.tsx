import {
  Popover as HeadlessPopover,
  PopoverButton,
  PopoverPanel,
  PopoverPanelProps,
} from '@headlessui/react';

export type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  anchor?: PopoverPanelProps['anchor'];
};

export const Popover = ({ trigger, children, anchor }: PopoverProps) => {
  return (
    <HeadlessPopover className="absolute">
      <PopoverButton className="cursor-pointer">{trigger}</PopoverButton>
      <PopoverPanel
        className="text-foreground bg-primary border-border shadow-shadow absolute border-2"
        anchor={anchor}
      >
        {children}
      </PopoverPanel>
    </HeadlessPopover>
  );
};
