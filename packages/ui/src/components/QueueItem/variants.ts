import { cva } from 'class-variance-authority';

export const queueItemVariants = cva(
  'group relative flex items-center gap-2 overflow-hidden ring-offset-white transition-all',
  {
    variants: {
      status: {
        idle: '',
        loading: 'opacity-70',
        error: '',
        success: '',
      },
      isCurrent: {
        true: 'bg-primary',
        false: '',
      },
      isCollapsed: {
        true: 'h-16 w-16 justify-center p-0',
        false: 'w-full p-0',
      },
    },
    defaultVariants: {
      status: 'idle',
      isCurrent: false,
      isCollapsed: false,
    },
  },
);
