import { createFileRoute } from '@tanstack/react-router';

import { Themes } from '../views/Themes/Themes';

export const Route = createFileRoute('/themes')({
  component: Themes,
});
