import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

import { Track } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { useColumns } from './hooks/useColumns';
import { useSorting } from './hooks/useSorting';
import { SortableRow } from './SortableRow';
import { TrackTableProps } from './types';
import { DEFAULT_OVERSCAN, DEFAULT_ROW_HEIGHT } from './utils/constants';

export function TrackTable<T extends Track = Track>({
  tracks,
  labels,
  classes,
  display,
  features,
  onReorder,
  rowHeight = DEFAULT_ROW_HEIGHT,
  overscan = DEFAULT_OVERSCAN,
}: TrackTableProps<T>) {
  const { sorting, setSorting, isSorted } = useSorting();

  const handleDragStart = () => {
    // TODO: use this for drag overlay
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    if (onReorder) {
      const oldIndex = tracks.findIndex(
        (track) => track.source.id === active.id,
      );
      const newIndex = tracks.findIndex((track) => track.source.id === over.id);

      const newOrder = [...tracks];
      const [movedTrack] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedTrack);

      onReorder(newOrder.map((track) => track.source.id));
    }
  };

  const columns: ColumnDef<T>[] = useColumns<T>({ display, labels });

  const table = useReactTable({
    columns,
    data: tracks,
    state: { sorting },
    enableSortingRemoval: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();
  const colCount = table.getVisibleFlatColumns().length;

  const scrollParentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: tracks.length,
    estimateSize: () => rowHeight,
    getScrollElement: () => scrollParentRef.current,
    overscan,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? rowVirtualizer.getTotalSize() -
        virtualItems[virtualItems.length - 1].end
      : 0;

  return (
    <div ref={scrollParentRef} className="flex h-auto overflow-auto">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext
          items={tracks.map((track) => track.source.id)}
          strategy={verticalListSortingStrategy}
        >
          <table
            role="table"
            className={cn(
              'border-border relative m-2 w-full border-2 select-none',
              classes?.root,
            )}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  role="row"
                  className="border-border bg-primary border-b-2"
                >
                  {headerGroup.headers.map((header) =>
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    ),
                  )}
                </tr>
              ))}
            </thead>
            <tbody>
              {paddingTop > 0 && (
                <tr style={{ height: paddingTop }} className="border-none">
                  <td colSpan={colCount} />
                </tr>
              )}
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <SortableRow
                    key={row.id}
                    row={row}
                    style={{ height: rowHeight }}
                    isReorderable={features?.reorderable && !isSorted}
                  />
                );
              })}
              {paddingBottom > 0 && (
                <tr style={{ height: paddingBottom }} className="border-none">
                  <td colSpan={colCount} />
                </tr>
              )}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
