import { cva, VariantProps } from 'class-variance-authority';
import { LoaderPinwheel } from 'lucide-react';
import { FC } from 'react';

const loaderVariants = cva('', {
  variants: {
    size: {
      default: 24,
      sm: 16,
      lg: 32,
      xl: 48,
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type LoaderProps = VariantProps<typeof loaderVariants>;

export const Loader: FC<LoaderProps> = ({ size }) => (
  <LoaderPinwheel
    size={loaderVariants({ size })}
    //   Spinning animation
    className="animate-spin"
  />
);
