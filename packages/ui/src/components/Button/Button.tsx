import { Button as HeadlessButton } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '../../utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center rounded transition-all disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'text-foreground bg-primary border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y border-2 hover:shadow-none',
        noShadow: 'text-foreground bg-primary border-border border-2',
        text: 'text-foreground bg-transparent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'size-10 justify-center',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant, size, className, children, type, ...rest },
  ref,
) {
  return (
    <HeadlessButton
      as="button"
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      type={type ?? 'submit'}
      {...rest}
    >
      {children}
    </HeadlessButton>
  );
});
