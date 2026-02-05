import { createFileRoute } from '@tanstack/react-router';

import { Logs } from '../views/Logs';

export const Route = createFileRoute('/logs')({
  component: Logs,
});
