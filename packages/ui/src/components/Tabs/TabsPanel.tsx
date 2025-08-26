import { TabPanel } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';

import { cn } from '../../utils';
import { useTabsContext } from './context';

type TabsPanelProps = PropsWithChildren<{
  className?: string;
}>;

export const TabsPanel: FC<TabsPanelProps> = ({ children, className }) => {
  const { panelClassName } = useTabsContext();
  return (
    <TabPanel className={cn('outline-none', panelClassName, className)}>
      {children}
    </TabPanel>
  );
};
