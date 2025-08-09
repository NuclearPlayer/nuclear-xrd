import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, FC, ReactNode } from 'react';

import { cn } from '../../utils';

const boxVariants = cva(
  'flex h-full w-full rounded-base border-2 border-border text-foreground p-4',
  {
    variants: {
      variant: {
        primary: 'bg-primary',
        secondary: 'bg-background',
        tertiary: 'bg-background-secondary',
      },
      shadow: {
        default: 'shadow-shadow',
        none: 'shadow-none',
      },
    },
    defaultVariants: {
      variant: 'primary',
      shadow: 'default',
    },
  },
);

type BoxProps = ComponentProps<'div'> &
  VariantProps<typeof boxVariants> & {
    children: ReactNode;
  };

export const Box: FC<BoxProps> = ({
  children,
  className,
  variant,
  shadow,
  ...props
}) => (
  <div className={cn(boxVariants({ variant, shadow, className }))} {...props}>
    {children}
  </div>
);
