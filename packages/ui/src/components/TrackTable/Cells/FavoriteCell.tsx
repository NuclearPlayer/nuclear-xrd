import { CellContext } from '@tanstack/react-table';

import { Track } from '@nuclearplayer/model';

import { FavoriteButton } from '../../FavoriteButton';

type FavoriteCellMeta = {
  onToggleFavorite: (track: Track) => void;
  isTrackFavorite: (track: Track) => boolean;
  favoriteLabel: string;
  unfavoriteLabel: string;
};

export const FavoriteCell = <T extends Track>({
  row,
  table,
}: CellContext<T, unknown>) => {
  const meta = table.options.meta as FavoriteCellMeta;
  const track = row.original;

  const isFavorite = meta.isTrackFavorite(track);

  return (
    <td className="w-10 text-center">
      <FavoriteButton
        size="sm"
        isFavorite={isFavorite}
        onToggle={() => meta.onToggleFavorite(track)}
        ariaLabelAdd={meta.favoriteLabel}
        ariaLabelRemove={meta.unfavoriteLabel}
      />
    </td>
  );
};
