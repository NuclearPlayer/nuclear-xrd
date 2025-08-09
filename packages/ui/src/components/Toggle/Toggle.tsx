import { ComponentProps, FC, useState } from 'react';

import { cn } from '../../utils';

type ToggleProps = Omit<ComponentProps<'button'>, 'onChange'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
};

export const Toggle: FC<ToggleProps> = ({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  className,
  disabled,
  label,
  ...rest
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = checkedProp !== undefined ? checkedProp : internalChecked;

  const handleToggle = () => {
    if (disabled) return;

    const newChecked = !checked;
    if (checkedProp === undefined) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center h-6 w-11 rounded-full border-2 border-border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        checked ? 'bg-primary' : 'bg-white',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      onClick={handleToggle}
      {...rest}
    >
      <span
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white border-2 border-border ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  );
};
