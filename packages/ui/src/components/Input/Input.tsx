import { Input as HeadlessInput } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, useId } from 'react';

import { cn } from '../../utils';

const inputVariants = cva(
  'border-border bg-background-input text-foreground placeholder:text-foreground-secondary w-full rounded border-2 px-3 transition-colors focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none',
  {
    variants: {
      variant: {
        text: '',
        number: '',
        password: '',
      },
      size: {
        sm: 'h-9 text-sm',
        default: 'h-11',
        lg: 'h-12 text-lg',
      },
      state: {
        normal: '',
        error: 'border-accent-red',
      },
    },
    defaultVariants: {
      variant: 'text',
      size: 'default',
      state: 'normal',
    },
  },
);

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    description?: string;
    error?: string;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, description, error, variant = 'text', size, className, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');

  const state = error ? 'error' : 'normal';
  const inputType: 'text' | 'number' | 'password' = (variant ?? 'text') as
    | 'text'
    | 'number'
    | 'password';

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          id={labelId}
          className="text-foreground text-sm font-semibold"
        >
          {label}
        </label>
      )}
      <HeadlessInput
        as="input"
        id={inputId}
        ref={ref}
        type={inputType}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedBy || undefined}
        aria-invalid={!!error || undefined}
        aria-errormessage={error ? errorId : undefined}
        inputMode={variant === 'number' ? 'numeric' : undefined}
        invalid={!!error}
        className={cn(inputVariants({ variant, size, state, className }))}
        {...rest}
      />
      {description && (
        <p
          id={descriptionId}
          className="text-foreground-secondary text-sm select-none"
        >
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-accent-red text-xs select-none">
          {error}
        </p>
      )}
    </div>
  );
});
