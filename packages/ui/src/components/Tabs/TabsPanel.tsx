import { TabPanel } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';

import { cn } from '../../utils';
import { ScrollableArea } from '../ScrollableArea';
import { useTabsContext } from './context';

type TabsPanelProps = PropsWithChildren<{
  className?: string;
}>;

export const TabsPanel: FC<TabsPanelProps> = ({ children, className }) => {
  const { panelClassName } = useTabsContext();
  return (
    <TabPanel
      className={cn(
        'relative flex-1 overflow-hidden outline-none',
        panelClassName,
        className,
      )}
    >
      <ScrollableArea>{children}</ScrollableArea>
    </TabPanel>
  );
};
