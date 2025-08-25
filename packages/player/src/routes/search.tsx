import { createFileRoute } from '@tanstack/react-router';

import { Search } from '../views/Search';

export const Route = createFileRoute('/search')({
  component: Search,
});
