import { createFileRoute } from '@tanstack/react-router';

import { Dashboard } from '../views/Dashboard';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});
