import { useCallback, useRef, useState } from 'react';

import { SIDEBAR_CONFIG } from './constants';

export const useSidebarResize = (
  width: number,
  onWidthChange: (width: number) => void,
  side: 'left' | 'right',
  isCollapsed: boolean,
) => {
  const isResizing = useRef(false);
  const [isResizingState, setIsResizingState] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isCollapsed) return;

      isResizing.current = true;
      setIsResizingState(true);
      e.preventDefault();

      const startX = e.clientX;
      const startWidth = width;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return;

        const deltaX =
          side === 'left' ? e.clientX - startX : startX - e.clientX;
        const newWidth = Math.max(
          SIDEBAR_CONFIG.MIN_WIDTH,
          Math.min(SIDEBAR_CONFIG.MAX_WIDTH, startWidth + deltaX),
        );
        onWidthChange(newWidth);
      };

      const handleMouseUp = () => {
        isResizing.current = false;
        setIsResizingState(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [width, onWidthChange, side, isCollapsed],
  );

  return { handleMouseDown, isResizingState };
};
