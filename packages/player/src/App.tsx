import { createRouter, RouterProvider } from '@tanstack/react-router';
import { MotionConfig } from 'framer-motion';

import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <MotionConfig
      reducedMotion={process.env.NODE_ENV === 'test' ? 'always' : 'user'}
    >
      <RouterProvider router={router} />
    </MotionConfig>
  );
}

export default App;
