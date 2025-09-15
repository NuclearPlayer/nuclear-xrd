import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

import { Artist } from '../../../views/Artist/Artist';

export const Route = createFileRoute('/artist/$providerId/$artistId')({
  params: {
    parse: (params) => ({
      providerId: z.string().parse(params.providerId),
      artistId: z.string().parse(params.artistId),
    }),
    stringify: ({ providerId, artistId }) => ({
      providerId: `${providerId}`,
      artistId: `${artistId}`,
    }),
  },
  component: Artist,
});
