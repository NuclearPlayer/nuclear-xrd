import { ComponentProps, FC, ReactNode, useState } from 'react';

import { cn } from '../../utils';

type ToggleProps = Omit<ComponentProps<'button'>, 'onChange'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  thumbIcon?: ReactNode;
  checkedThumbIcon?: ReactNode;
};

export const Toggle: FC<ToggleProps> = ({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  className,
  disabled,
  label,
  thumbIcon,
  checkedThumbIcon,
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
        {
          'bg-primary': checked,
          'bg-white': !checked,
          'opacity-50 cursor-not-allowed': disabled,
        },
        className,
      )}
      onClick={handleToggle}
      {...rest}
    >
      <span
        className={cn(
          'pointer-events-none flex items-center justify-center h-4 w-4 rounded-full bg-white border-2 border-border ring-0 transition-transform [&>svg]:fill-white dark:[&>svg]:fill-black',
          {
            'translate-x-5': checked,
            'translate-x-1': !checked,
          },
        )}
      >
        {checked && checkedThumbIcon ? checkedThumbIcon : thumbIcon}
      </span>
    </button>
  );
};
