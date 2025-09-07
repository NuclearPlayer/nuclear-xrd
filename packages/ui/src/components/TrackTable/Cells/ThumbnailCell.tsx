import { CellContext } from '@tanstack/react-table';

import { Artwork, Track } from '@nuclearplayer/model';

export const ThumbnailCell = <T extends Track>({
  getValue,
}: CellContext<T, Artwork>) => {
  return (
    <div className="h-10 w-10">
      <img className="object-cover" src={getValue()?.url} />
    </div>
  );
};
