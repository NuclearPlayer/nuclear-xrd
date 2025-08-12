import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelLeft, PanelRight } from 'lucide-react';
import { FC, ReactNode, useRef } from 'react';

import { Button } from '../Button';
import { SIDEBAR_CONFIG } from './constants';
import { useSidebarResize } from './hooks';

export type PlayerWorkspaceSidebarPropsBase = {
  children?: ReactNode;
  isCollapsed: boolean;
  width: number;
  onWidthChange: (width: number) => void;
  onToggle: () => void;
  className?: string;
};

type PlayerWorkspaceSidebarProps = PlayerWorkspaceSidebarPropsBase & {
  side: 'left' | 'right';
};

export const PlayerWorkspaceSidebar: FC<PlayerWorkspaceSidebarProps> = ({
  children,
  isCollapsed,
  width,
  onWidthChange,
  onToggle,
  side,
  className = '',
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { handleMouseDown, isResizingState } = useSidebarResize(
    width,
    onWidthChange,
    side,
    isCollapsed,
  );

  const currentWidth = isCollapsed ? SIDEBAR_CONFIG.COLLAPSED_WIDTH : width;

  return (
    <motion.div
      ref={sidebarRef}
      className={clsx(
        'bg-background-secondary border-border relative flex flex-col p-2',
        { 'border-r-2': side === 'left', 'border-l-2': side === 'right' },
        className,
      )}
      animate={{ width: currentWidth }}
      transition={
        isResizingState
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }
      }
    >
      <span
        className={clsx('mb-4 flex flex-row items-center', {
          'justify-end': side === 'left',
          'justify-start': side === 'right',
        })}
      >
        <Button
          data-testid={`sidebar-toggle-${side}`}
          className={clsx('top-2 px-2', {
            'right-1': side === 'left',
            'left-1': side === 'right',
          })}
          size="icon"
          onClick={onToggle}
        >
          {side === 'left' ? <PanelLeft /> : <PanelRight />}
        </Button>
      </span>
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
              mass: 0.5,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {!isCollapsed && (
        <div
          className={`absolute top-0 bottom-0 w-1 cursor-col-resize transition-colors ${
            side === 'left' ? 'right-0' : 'left-0'
          }`}
          onMouseDown={handleMouseDown}
        />
      )}
    </motion.div>
  );
};
