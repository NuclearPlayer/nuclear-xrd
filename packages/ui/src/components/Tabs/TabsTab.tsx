import { Tab } from '@headlessui/react';
import { FC, Fragment, PropsWithChildren } from 'react';

import { cn } from '../../utils';
import { useTabsContext } from './context';

type TabsTabProps = PropsWithChildren<{
  disabled?: boolean;
  className?: string;
}>;

export const TabsTab: FC<TabsTabProps> = ({
  children,
  disabled,
  className,
}) => {
  const { tabClassName } = useTabsContext();
  return (
    <Tab as={Fragment} disabled={disabled}>
      {({ selected }) => (
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'text-foreground rounded border-2 border-transparent bg-transparent px-3 py-2 text-sm transition-colors',
            'hover:underline',
            'data-[selected=true]:bg-primary data-[selected=true]:border-border',
            'focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            tabClassName,
            className,
          )}
          data-selected={selected ? '' : undefined}
        >
          {children}
        </button>
      )}
    </Tab>
  );
};
