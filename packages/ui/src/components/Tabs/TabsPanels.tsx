import { TabPanels } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';

import { cn } from '../../utils';
import { useTabsContext } from './context';

type TabsPanelsProps = PropsWithChildren<{
  className?: string;
}>;

export const TabsPanels: FC<TabsPanelsProps> = ({ children, className }) => {
  const {
    ids: { panelsId },
    panelsClassName,
  } = useTabsContext();
  return (
    <TabPanels
      id={panelsId}
      className={cn(
        'mt-2 flex flex-1 flex-col overflow-hidden',
        panelsClassName,
        className,
      )}
    >
      {children}
    </TabPanels>
  );
};
