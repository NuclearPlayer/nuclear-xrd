import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

const buttonVariants = cva(
  'inline-flex items-center transition-all rounded cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'text-foreground bg-primary border-2 border-border shadow-shadow hover:translate-x-shadow-x hover:translate-y-shadow-y hover:shadow-none',
        noShadow: 'text-foreground bg-primary border-2 border-border',
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

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>;

export const Button: FC<ButtonProps> = ({
  variant,
  size,
  className,
  children,
  ...rest
}) => (
  <button
    className={cn(buttonVariants({ variant, size, className }))}
    {...rest}
  >
    {children}
  </button>
);
