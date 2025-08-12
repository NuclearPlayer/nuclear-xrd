import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';

import { Button } from '../Button/Button';

type SidebarNavigationCollapsibleProps = {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
};
export const SidebarNavigationCollapsible: FC<
  SidebarNavigationCollapsibleProps
> = ({ children, title, icon }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div className={clsx('mb-4 flex w-full flex-col text-sm')}>
      <Button
        variant={isCollapsed ? 'text' : 'noShadow'}
        size="sm"
        className="inline-flex flex-row items-center justify-between"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="inline-flex flex-row items-center gap-2">
          {icon}
          {title}
        </span>
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 90 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <ChevronRight />
        </motion.div>
      </Button>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="border-l-foreground ml-4 flex flex-col gap-4 overflow-hidden border-l-2 pt-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
