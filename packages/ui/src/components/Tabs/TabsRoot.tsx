import { TabGroup } from '@headlessui/react';
import { FC, PropsWithChildren, useId } from 'react';

import { cn } from '../../utils';
import { TabsContext } from './context';

type TabsRootProps = PropsWithChildren<{
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  vertical?: boolean;
  manual?: boolean;
  className?: string;
  listClassName?: string;
  tabClassName?: string;
  panelsClassName?: string;
  panelClassName?: string;
}>;

export const TabsRoot: FC<TabsRootProps> = ({
  children,
  defaultIndex,
  selectedIndex,
  onChange,
  vertical,
  manual,
  className,
  listClassName,
  tabClassName,
  panelsClassName,
  panelClassName,
}) => {
  const reactId = useId();
  const groupId = `tabs-${reactId}`;
  const listId = `${groupId}-list`;
  const panelsId = `${groupId}-panels`;

  return (
    <TabGroup
      as="div"
      className={cn('flex w-full flex-col gap-2', className)}
      defaultIndex={selectedIndex === undefined ? defaultIndex : undefined}
      selectedIndex={selectedIndex}
      onChange={onChange}
      vertical={vertical}
      manual={manual}
    >
      {({ selectedIndex: idx }) => (
        <TabsContext.Provider
          value={{
            ids: { groupId, listId, panelsId },
            selectedIndex: idx,
            vertical,
            manual,
            listClassName,
            tabClassName,
            panelsClassName,
            panelClassName,
          }}
        >
          {children}
        </TabsContext.Provider>
      )}
    </TabGroup>
  );
};
