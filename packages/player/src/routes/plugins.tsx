import { createFileRoute } from '@tanstack/react-router';

import { Plugins } from '../views/Plugins/Plugins';

export const Route = createFileRoute('/plugins')({
  component: Plugins,
});
