import { TabList } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';

import { cn } from '../../utils';
import { useTabsContext } from './context';

type TabsListProps = PropsWithChildren<{
  className?: string;
}>;

export const TabsList: FC<TabsListProps> = ({ children, className }) => {
  const {
    ids: { listId },
    listClassName,
  } = useTabsContext();
  return (
    <TabList
      id={listId}
      className={cn('flex w-full items-center gap-2', listClassName, className)}
    >
      {children}
    </TabList>
  );
};
