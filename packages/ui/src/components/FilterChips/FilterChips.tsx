import { cva } from 'class-variance-authority';
import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';

const chipVariants = cva(
  'border-border inline-flex cursor-pointer items-center justify-center rounded-full border-2 px-3 py-1 text-sm font-medium transition-colors',
  {
    variants: {
      selected: {
        true: 'bg-foreground text-background',
        false: 'text-foreground hover:bg-foreground/10 bg-transparent',
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

export type FilterChip = {
  id: string;
  label: string;
};

type FilterChipsProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  items: FilterChip[];
  selected: string;
  onChange: (id: string) => void;
};

export const FilterChips: FC<FilterChipsProps> = ({
  items,
  selected,
  onChange,
  className,
  ...props
}) => (
  <div
    data-testid="filter-chips"
    className={cn('flex flex-wrap gap-2', className)}
    role="group"
    aria-label="Filter options"
    {...props}
  >
    {items.map((item) => (
      <button
        key={item.id}
        type="button"
        role="radio"
        aria-checked={selected === item.id}
        className={chipVariants({ selected: selected === item.id })}
        onClick={() => onChange(item.id)}
      >
        {item.label}
      </button>
    ))}
  </div>
);
