import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { FC } from 'react';

import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

type AppProps = {
  routerProp?: typeof router;
};

const App: FC<AppProps> = ({ routerProp }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routerProp ?? router} />
    </QueryClientProvider>
  );
};

export default App;
