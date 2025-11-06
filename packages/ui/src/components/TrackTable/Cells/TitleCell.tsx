import { CellContext } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import { Track } from '@nuclearplayer/model';

import { Button } from '../../Button';

type TitleCellMeta = {
  displayQueueControls?: boolean;
  onAddToQueue?: (track: Track) => void;
};

export const TitleCell = <T extends Track>({
  getValue,
  row,
  table,
}: CellContext<T, string | number | undefined>) => {
  const meta = table.options.meta as TitleCellMeta | undefined;
  const showControls = meta?.displayQueueControls;

  return (
    <td className="cursor-default truncate px-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 truncate">{getValue()}</div>
        {showControls && meta?.onAddToQueue && (
          <Button
            size="icon-sm"
            variant="text"
            className="opacity-0 transition-none group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              meta.onAddToQueue?.(row.original);
            }}
            aria-label="Add to queue"
          >
            <Plus size={16} />
          </Button>
        )}
      </div>
    </td>
  );
};
