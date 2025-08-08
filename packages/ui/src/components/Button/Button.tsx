import { cva, type VariantProps } from 'class-variance-authority';
import { FC } from 'react';

import { cn } from '../../utils';

const buttonVariants = cva('inline-flex items-center transition-all rounded', {
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
      icon: 'size-10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const Button: FC<
  React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>
> = ({ variant, size, className, children, ...rest }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...rest}
    >
      {children}
    </button>
  );
};
