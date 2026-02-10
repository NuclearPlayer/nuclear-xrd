import { CellContext } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Track } from '@nuclearplayer/model';

import { Button } from '../../Button';

type RemoveCellMeta = {
  onRemove: (track: Track) => void;
};

export const RemoveCell = <T extends Track>({
  row,
  table,
}: CellContext<T, unknown>) => {
  const meta = table.options.meta as RemoveCellMeta;
  const track = row.original;

  return (
    <td className="w-10 text-center">
      {/* onPointerDown stop propagation is needed to be able to remove items that are also draggable */}
      <Button
        size="icon-sm"
        variant="text"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          meta.onRemove(track);
        }}
        aria-label="Remove from list"
      >
        <Trash2 size={16} className="text-foreground-secondary" />
      </Button>
    </td>
  );
};
