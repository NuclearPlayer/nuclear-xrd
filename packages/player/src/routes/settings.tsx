import { createFileRoute } from '@tanstack/react-router';

import { Settings } from '../views/Settings/Settings';

export const Route = createFileRoute('/settings')({
  component: Settings,
});
