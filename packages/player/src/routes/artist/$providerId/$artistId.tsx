import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

import { Artist as ArtistModel } from '@nuclearplayer/model';

// import { providersServiceHost } from '../../../services/providersService';
import { Artist } from '../../../views/Artist/Artist';

const ArtistView = () => {
  const artist = Route.useLoaderData();
  return <Artist artist={artist} />;
};

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
  loader: async ({
    params: { providerId, artistId },
  }): Promise<ArtistModel> => {
    // const provider = providersServiceHost.get(providerId);
    // const artist = await provider?(artistId);
    // return { artist };

    return {
      name: 'test artist',
      source: {
        provider: providerId,
        id: artistId,
        url: 'test-url',
      },
    };
  },
  component: ArtistView,
});
