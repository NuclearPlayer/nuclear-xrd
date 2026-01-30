import { CellContext } from '@tanstack/react-table';

import { Track } from '@nuclearplayer/model';

import { FavoriteButton } from '../../FavoriteButton';

type FavoriteCellMeta = {
  onToggleFavorite?: (track: Track) => void;
  isTrackFavorite?: (track: Track) => boolean;
};

export const FavoriteCell = <T extends Track>({
  row,
  table,
}: CellContext<T, unknown>) => {
  const meta = table.options.meta as FavoriteCellMeta | undefined;
  const track = row.original;

  const isFavorite = meta?.isTrackFavorite?.(track) ?? false;
  const onToggle = meta?.onToggleFavorite;

  if (!onToggle) {
    return <td className="w-10" />;
  }

  return (
    <td className="w-10 text-center">
      <FavoriteButton
        size="sm"
        isFavorite={isFavorite}
        onToggle={() => onToggle(track)}
      />
    </td>
  );
};
