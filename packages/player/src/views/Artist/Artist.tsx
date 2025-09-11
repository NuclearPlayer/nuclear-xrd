import { FC } from 'react';

import { Artist as ArtistModel } from '@nuclearplayer/model';

type ArtistProps = {
  artist: ArtistModel;
};

export const Artist: FC<ArtistProps> = ({ artist }) => {
  return <div>Artist View: {artist.name}</div>;
};
