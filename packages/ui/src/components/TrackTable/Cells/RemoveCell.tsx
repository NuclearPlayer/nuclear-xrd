import { CellContext } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Track } from '@nuclearplayer/model';

import { Button } from '../../Button';

type RemoveCellMeta = {
  onRemove?: (track: Track) => void;
};

export const RemoveCell = <T extends Track>({
  row,
  table,
}: CellContext<T, unknown>) => {
  const meta = table.options.meta as RemoveCellMeta | undefined;
  const track = row.original;

  const onRemove = meta?.onRemove;

  if (!onRemove) {
    return <td className="w-10" />;
  }

  return (
    <td className="w-10 text-center">
      <Button
        size="icon-sm"
        variant="text"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(track);
        }}
        aria-label="Remove from list"
      >
        <Trash2 size={16} className="text-foreground-secondary" />
      </Button>
    </td>
  );
};
