import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { FC } from 'react';

export const DevTools: FC = () => {
  return (
    <TanStackDevtools
      plugins={[
        {
          name: 'React Query',
          render: <ReactQueryDevtoolsPanel />,
        },
        {
          name: 'React Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  );
};
