import { FilterIcon } from 'lucide-react';

import { Input } from '../Input';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function FilterBar({ value, onChange, placeholder, className }: Props) {
  return (
    <div className={['flex justify-end', className].filter(Boolean).join(' ')}>
      <div className="inline-flex w-full max-w-sm items-stretch">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'Filter tracks'}
          endAddon={
            <FilterIcon
              className="h-4 w-4"
              aria-hidden="true"
              strokeWidth={3}
            />
          }
        />
      </div>
    </div>
  );
}
