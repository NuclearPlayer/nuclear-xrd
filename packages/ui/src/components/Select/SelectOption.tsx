import { ListboxOption } from '@headlessui/react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type SelectOptionProps = {
  id: string;
  label: string;
  as?: React.ElementType;
  children?: ReactNode;
};

export const SelectOption: FC<SelectOptionProps> = ({
  id,
  label,
  as = 'li',
  children,
}) => {
  return (
    <ListboxOption value={id} as={as}>
      {({ active, selected }) => (
        <div
          className={cn(
            'text-foreground cursor-pointer px-1 py-1',
            active && 'outline-border outline-2',
          )}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="relative inline-flex w-full flex-row items-center justify-between">
            {children ?? label}
            {selected && <span className="flex items-center">✓</span>}
          </span>
        </div>
      )}
    </ListboxOption>
  );
};
