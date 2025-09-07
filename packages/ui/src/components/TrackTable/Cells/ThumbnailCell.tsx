import { CellContext } from '@tanstack/react-table';

import { Artwork, Track } from '@nuclearplayer/model';

export const ThumbnailCell = <T extends Track>({
  getValue,
}: CellContext<T, Artwork>) => {
  return (
    <td className="text-center">
      <div className="flex w-full justify-center">
        <img className="w-10 min-w-10" src={getValue()?.url} />
      </div>
    </td>
  );
};
