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
        'border-border focus:ring-primary relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full border-2 transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none',
        {
          'bg-primary': checked,
          'bg-white': !checked,
          'cursor-not-allowed opacity-50': disabled,
        },
        className,
      )}
      onClick={handleToggle}
      {...rest}
    >
      <span
        className={cn(
          'border-border pointer-events-none flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white ring-0 transition-transform [&>svg]:fill-white dark:[&>svg]:fill-black',
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
