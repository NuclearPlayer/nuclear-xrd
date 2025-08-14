import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FC, useEffect, useId, useMemo, useRef, useState } from 'react';

import { cn } from '../../utils';

const selectVariants = cva(
  'border-border bg-primary text-foreground focus-visible:ring-primary relative flex h-11 w-full items-center justify-between rounded border-2 px-3 pr-8 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
  {
    variants: {
      size: {
        default: 'px-3 py-2 text-sm',
      },
      state: {
        normal: '',
        error: 'border-accent-red',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'normal',
    },
  },
);

export type SelectOption = { id: string; label: string };

type SelectProps = VariantProps<typeof selectVariants> & {
  id?: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export const Select: FC<SelectProps> = ({
  id,
  label,
  description,
  error,
  options,
  value,
  defaultValue,
  onValueChange,
  size,
  className,
  disabled,
}) => {
  const reactId = useId();
  const selectId = id ?? `select-${reactId}`;
  const labelId = `${selectId}-label`;
  const descriptionId = `${selectId}-description`;
  const errorId = `${selectId}-error`;
  const listboxId = `${selectId}-listbox`;

  const describedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');

  const state = error ? 'error' : 'normal';

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | undefined>(
    defaultValue ?? options[0]?.id,
  );
  const currentValue = isControlled ? (value as string) : (internal as string);
  const selected = useMemo(
    () => options.find((o) => o.id === currentValue) ?? options[0],
    [currentValue, options],
  );

  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number>(() =>
    Math.max(
      0,
      options.findIndex((o) => o.id === currentValue),
    ),
  );
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.focus();
    }
  }, [open]);

  const commit = (val: string) => {
    if (!isControlled) setInternal(val);
    onValueChange?.(val);
    setOpen(false);
  };

  const onTriggerKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    if (
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'Enter' ||
      e.key === ' '
    ) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIndex((i) => Math.min(i + 1, options.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setFocusIndex(0);
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      setFocusIndex(options.length - 1);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      commit(options[focusIndex]?.id ?? options[0]?.id);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={selectId}
          id={labelId}
          className="text-foreground text-sm font-semibold"
        >
          {label}
        </label>
      )}
      <button
        id={selectId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedBy || undefined}
        aria-invalid={!!error || undefined}
        aria-errormessage={error ? errorId : undefined}
        className={cn(selectVariants({ size, state, className }))}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        disabled={disabled}
      >
        <span className="block truncate">{selected?.label}</span>
        <span className="flex items-center">
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={cn(
              'text-foreground transition-transform',
              open && 'rotate-180',
            )}
          />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={label ? labelId : undefined}
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              mass: 0.9,
            }}
            className="border-border shadow-shadow bg-primary absolute top-18 left-0 z-50 w-full rounded border-2 p-2 outline-none"
            onKeyDown={onListKeyDown}
          >
            {options.map((opt, idx) => {
              const selectedOpt = opt.id === currentValue;
              const highlighted = idx === focusIndex;
              return (
                <li
                  key={opt.id}
                  role="option"
                  aria-selected={selectedOpt}
                  className={cn(
                    'text-foreground cursor-pointer px-1 py-1',
                    highlighted && 'outline-border outline-2',
                  )}
                  onMouseEnter={() => setFocusIndex(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(opt.id)}
                >
                  <span className="relative inline-flex w-full flex-row items-center justify-between">
                    {opt.label}
                    {selectedOpt && (
                      <span className="flex items-center">✓</span>
                    )}
                  </span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
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
};
