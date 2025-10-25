import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { FC } from 'react';

import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });
const defaultQueryClient = new QueryClient();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

type AppProps = {
  routerProp?: typeof router;
  queryClientProp?: QueryClient;
};

const App: FC<AppProps> = ({ routerProp, queryClientProp }) => {
  return (
    <QueryClientProvider client={queryClientProp ?? defaultQueryClient}>
      <RouterProvider router={routerProp ?? router} />
    </QueryClientProvider>
  );
};

export default App;
