import { createContext, useContext } from 'react';

type TabsContextValue = {
  ids: {
    groupId: string;
    listId: string;
    panelsId: string;
  };
  selectedIndex: number;
  vertical?: boolean;
  manual?: boolean;
  listClassName?: string;
  tabClassName?: string;
  panelsClassName?: string;
  panelClassName?: string;
};

export const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabsContext = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tabs.* must be used within <Tabs.Root>');
  }
  return ctx;
};
