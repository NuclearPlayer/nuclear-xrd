import { AnimatePresence, motion } from 'framer-motion';
import { FC, ReactNode, useRef } from 'react';

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
      className={`bg-gray-800 border-gray-700 flex relative ${
        side === 'left' ? 'border-r' : 'border-l'
      } ${className}`}
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
          className={`absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors ${
            side === 'left' ? 'right-0' : 'left-0'
          }`}
          onMouseDown={handleMouseDown}
        />
      )}

      <button
        onClick={onToggle}
        className={`absolute top-2 w-4 h-4 bg-gray-600 hover:bg-gray-500 rounded-sm flex items-center justify-center text-xs text-gray-300 ${
          side === 'left' ? 'right-1' : 'left-1'
        }`}
      >
        {isCollapsed
          ? side === 'left'
            ? '›'
            : '‹'
          : side === 'left'
            ? '‹'
            : '›'}
      </button>
    </motion.div>
  );
};
