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
    <div className={clsx('flex flex-col gap-2 w-full')}>
      <Button
        variant="text"
        className="inline-flex flex-row items-center justify-between"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {icon}
        {title}
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
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
