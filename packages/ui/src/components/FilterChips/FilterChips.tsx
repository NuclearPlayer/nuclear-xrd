import { cva } from 'class-variance-authority';
import { ComponentProps, FC } from 'react';

import { cn } from '../../utils';
import { useFilterChips, UseFilterChipsConfig } from './useFilterChips';

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

type BaseProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  items: FilterChip[];
};

type SingleSelectProps = BaseProps & {
  multiple?: false;
  selected: string;
  onChange: (id: string) => void;
};

type MultiSelectProps = BaseProps & {
  multiple: true;
  selected: string[];
  onChange: (ids: string[]) => void;
};

export type FilterChipsProps = SingleSelectProps | MultiSelectProps;

export const FilterChips: FC<FilterChipsProps> = (props) => {
  const { items, className, multiple, selected, onChange, ...rest } = props;

  const { isSelected, handleClick } = useFilterChips({
    multiple,
    selected,
    onChange,
  } as UseFilterChipsConfig);

  return (
    <div
      data-testid="filter-chips"
      className={cn('flex flex-wrap gap-2', className)}
      role="group"
      aria-label="Filter options"
      {...rest}
    >
      {items.map((item) => {
        const selected = isSelected(item.id);
        return (
          <button
            key={item.id}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={selected}
            className={chipVariants({ selected })}
            onClick={() => handleClick(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
