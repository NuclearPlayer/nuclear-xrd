import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { Search } from '../views/Search/Search';

export const Route = createFileRoute('/search')({
  component: Search,
  validateSearch: z.object({
    q: z.string().min(1).max(100).default(''),
  }),
});
