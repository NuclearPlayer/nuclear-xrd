import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, FC, ReactNode } from 'react';

import { cn } from '../../utils';

const badgeVariants = cva(
  'border-border inline-flex items-center justify-center border-2',
  {
    variants: {
      variant: {
        dot: 'size-2.5 rounded-full',
        pill: 'rounded-full px-2 py-0.5 text-xs font-semibold',
      },
      color: {
        green: '',
        cyan: '',
        orange: '',
        red: '',
        yellow: '',
      },
      animated: {
        true: 'animate-pulse',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'dot',
        color: 'green',
        className: 'bg-accent-green',
      },
      {
        variant: 'dot',
        color: 'cyan',
        className: 'bg-accent-cyan',
      },
      {
        variant: 'dot',
        color: 'orange',
        className: 'bg-accent-orange',
      },
      {
        variant: 'dot',
        color: 'red',
        className: 'bg-accent-red',
      },
      {
        variant: 'dot',
        color: 'yellow',
        className: 'bg-accent-yellow',
      },
      {
        variant: 'pill',
        color: 'green',
        className: 'bg-accent-green text-foreground',
      },
      {
        variant: 'pill',
        color: 'cyan',
        className: 'bg-accent-cyan text-foreground',
      },
      {
        variant: 'pill',
        color: 'orange',
        className: 'bg-accent-orange text-foreground',
      },
      {
        variant: 'pill',
        color: 'red',
        className: 'bg-accent-red text-foreground',
      },
      {
        variant: 'pill',
        color: 'yellow',
        className: 'bg-accent-yellow text-foreground',
      },
    ],
    defaultVariants: {
      variant: 'dot',
      color: 'green',
      animated: false,
    },
  },
);

type BadgeProps = Omit<ComponentProps<'span'>, 'children'> &
  VariantProps<typeof badgeVariants> & {
    children?: ReactNode;
  };

export const Badge: FC<BadgeProps> = ({
  children,
  className,
  variant,
  color,
  animated,
  ...props
}) => {
  if (variant === 'dot' && children) {
    throw new Error('Badge variant "dot" does not support children');
  }

  return (
    <span
      className={cn(badgeVariants({ variant, color, animated, className }))}
      {...props}
    >
      {children}
    </span>
  );
};
