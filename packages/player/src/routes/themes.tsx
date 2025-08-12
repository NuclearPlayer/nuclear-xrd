import { createFileRoute } from '@tanstack/react-router';

import { Themes } from '../views/Themes';

export const Route = createFileRoute('/themes')({
  component: Themes,
});
