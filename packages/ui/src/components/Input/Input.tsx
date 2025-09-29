import { Input as HeadlessInput } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useId,
  type ReactNode,
} from 'react';

import { cn } from '../../utils';

const inputVariants = cva(
  'border-border bg-background-input text-foreground placeholder:text-foreground-secondary w-full px-3 transition-colors focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none',
  {
    variants: {
      variant: {
        text: '',
        number: '',
        password: '',
      },
      size: {
        sm: 'h-9 text-sm',
        default: 'h-10',
        lg: 'h-11 text-lg',
      },
      state: {
        normal: '',
        error: 'border-accent-red',
      },
      withAddon: {
        false: 'rounded-md border-2',
        true: 'rounded-l border-t-2 border-r-0 border-b-2 border-l-2',
      },
    },
    defaultVariants: {
      variant: 'text',
      size: 'default',
      state: 'normal',
      withAddon: false,
    },
  },
);

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    description?: string;
    error?: string;
    endAddon?: ReactNode;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    description,
    error,
    variant = 'text',
    size,
    className,
    endAddon,
    ...rest
  },
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
      {endAddon ? (
        <div className="inline-flex w-full items-stretch">
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
            className={cn(
              inputVariants({
                variant,
                size,
                state,
                withAddon: true,
                className,
              }),
            )}
            {...rest}
          />
          <div className="bg-primary border-border flex items-center gap-2 rounded-r border-2 border-l-0 px-3 text-sm">
            {endAddon}
          </div>
        </div>
      ) : (
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
      )}
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
