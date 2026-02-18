import { FC, ReactNode } from 'react';

import { TabsList } from './TabsList';
import { TabsPanel } from './TabsPanel';
import { TabsPanels } from './TabsPanels';
import { TabsRoot } from './TabsRoot';
import { TabsTab } from './TabsTab';

export type TabsItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items?: TabsItem[];
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
};

type TabsComponent = FC<TabsProps> & {
  Root: typeof TabsRoot;
  List: typeof TabsList;
  Tab: typeof TabsTab;
  Panels: typeof TabsPanels;
  Panel: typeof TabsPanel;
};

const TabsImpl: FC<TabsProps> = ({
  items,
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
  if (!items || items.length === 0) {
    // Composition mode only. Consumer uses Tabs.Root + subcomponents
    return (
      <TabsRoot
        defaultIndex={defaultIndex}
        selectedIndex={selectedIndex}
        onChange={onChange}
        vertical={vertical}
        manual={manual}
        className={className}
        listClassName={listClassName}
        tabClassName={tabClassName}
        panelsClassName={panelsClassName}
        panelClassName={panelClassName}
      />
    );
  }

  return (
    <TabsRoot
      defaultIndex={defaultIndex}
      selectedIndex={selectedIndex}
      onChange={onChange}
      vertical={vertical}
      manual={manual}
      className={className}
      listClassName={listClassName}
      tabClassName={tabClassName}
      panelsClassName={panelsClassName}
      panelClassName={panelClassName}
    >
      <TabsList>
        {items.map((it) => (
          <TabsTab key={it.id} disabled={it.disabled}>
            {it.label}
          </TabsTab>
        ))}
      </TabsList>
      <TabsPanels>
        {items.map((it) => (
          <TabsPanel key={it.id}>{it.content}</TabsPanel>
        ))}
      </TabsPanels>
    </TabsRoot>
  );
};

export const Tabs = TabsImpl as TabsComponent;
Tabs.Root = TabsRoot;
Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panels = TabsPanels;
Tabs.Panel = TabsPanel;
