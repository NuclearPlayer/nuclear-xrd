import { cva, VariantProps } from 'class-variance-authority';
import { Heart } from 'lucide-react';
import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';

const favoriteButtonVariants = cva('', {
  variants: {
    size: {
      sm: '',
      default: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const iconSizes = {
  sm: 16,
  default: 24,
} as const;

type FavoriteButtonProps = Omit<ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof favoriteButtonVariants> & {
    isFavorite: boolean;
    onToggle: () => void;
  };

export const FavoriteButton: FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  size = 'default',
  className,
  ...props
}) => {
  const iconSize = iconSizes[size ?? 'default'];
  const buttonSize = size === 'sm' ? 'icon-sm' : 'icon';

  return (
    <Button
      size={buttonSize}
      variant="text"
      className={cn(favoriteButtonVariants({ size, className }))}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      {...props}
    >
      <Heart
        size={iconSize}
        className={cn(
          'transition-colors',
          isFavorite
            ? 'fill-accent-red text-accent-red'
            : 'text-foreground-secondary hover:text-foreground',
        )}
      />
    </Button>
  );
};
