import type { DragEndEvent } from '@dnd-kit/core';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRef } from 'react';

import { Track } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { useColumns } from './hooks/useColumns';
import { useReorder } from './hooks/useReorder';
import { useSorting } from './hooks/useSorting';
import { useVirtualRows } from './hooks/useVirtualRows';
import { ReorderLayer } from './ReorderLayer';
import { SortableRow } from './SortableRow';
import { TrackTableProvider } from './TrackTableContext';
import { TrackTableProps } from './types';
import { DEFAULT_OVERSCAN, DEFAULT_ROW_HEIGHT } from './utils/constants';
import { VirtualizedBody } from './VirtualizedBody';

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
  const { onDragStart, onDragEnd } = useReorder<T>({ tracks, onReorder });

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
  const { virtualItems, paddingTop, paddingBottom } = useVirtualRows({
    count: rows.length,
    rowHeight,
    overscan,
    scrollParentRef,
  });

  const isReorderable = Boolean(features?.reorderable && !isSorted);

  const dndItems = virtualItems.map((v) => rows[v.index].original.source.id);

  return (
    <TrackTableProvider value={{ isReorderable }}>
      <div ref={scrollParentRef} className="relative flex h-full overflow-auto">
        <ReorderLayer
          enabled={isReorderable}
          items={dndItems}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd as (evt: DragEndEvent) => void}
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
            <VirtualizedBody
              rows={rows}
              virtualItems={virtualItems}
              paddingTop={paddingTop}
              paddingBottom={paddingBottom}
              colSpan={colCount}
              rowHeight={rowHeight}
              renderRow={({ row, virtual }) => (
                <SortableRow
                  key={row.original.source.id}
                  row={row}
                  style={{ height: rowHeight }}
                  isReorderable={isReorderable}
                  data-index={virtual.index}
                />
              )}
            />
          </table>
        </ReorderLayer>
      </div>
    </TrackTableProvider>
  );
}
