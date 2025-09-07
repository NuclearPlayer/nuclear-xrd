import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { flexRender, Row } from '@tanstack/react-table';

import { Track } from '@nuclearplayer/model';

import { cn } from '../../utils';

type SortableRowProps<T extends Track = Track> = {
  row: Row<T>;
  isReorderable?: boolean;
};

export function SortableRow<T extends Track = Track>({
  row,
  isReorderable = false,
}: SortableRowProps<T>) {
  const trackId = row.original.source.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: trackId,
    disabled: !isReorderable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn('cursor-pointer border-b-2 bg-white select-none', {
        '': !isDragging,
        'z-50': isDragging,
      })}
      {...attributes}
      {...listeners}
    >
      {row
        .getVisibleCells()
        .map((cell) =>
          flexRender(cell.column.columnDef.cell, cell.getContext()),
        )}
    </tr>
  );
}
