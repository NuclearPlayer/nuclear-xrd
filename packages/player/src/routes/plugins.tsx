import { createFileRoute } from '@tanstack/react-router';

import { Plugins } from '../views/Plugins';

export const Route = createFileRoute('/plugins')({
  component: Plugins,
});
