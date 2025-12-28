import { cva } from 'class-variance-authority';

export const queueItemVariants = cva(
  'group relative flex items-center gap-3 overflow-hidden ring-offset-white transition-all',
  {
    variants: {
      status: {
        idle: '',
        loading: 'opacity-70',
        error: 'ring-accent-red ring-2 ring-offset-2',
        success: '',
      },
      isCurrent: {
        true: '',
        false: '',
      },
      isCollapsed: {
        true: 'h-16 w-16 justify-center p-0',
        false: 'w-full p-3',
      },
    },
    compoundVariants: [
      {
        isCurrent: true,
        isCollapsed: false,
        className: 'bg-primary ring-0',
      },
      {
        status: 'error',
        isCurrent: true,
        isCollapsed: false,
        className: 'bg-primary ring-accent-red ring-2 ring-offset-2',
      },
    ],
    defaultVariants: {
      status: 'idle',
      isCurrent: false,
      isCollapsed: false,
    },
  },
);
