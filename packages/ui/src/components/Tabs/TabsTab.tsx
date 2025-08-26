import { Tab } from '@headlessui/react';
import { FC, Fragment, PropsWithChildren } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';
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
        <Button
          type="button"
          disabled={disabled}
          variant={selected ? 'default' : 'text'}
          className={cn(tabClassName, className)}
          data-selected={selected ? '' : undefined}
        >
          {children}
        </Button>
      )}
    </Tab>
  );
};
