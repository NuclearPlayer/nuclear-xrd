import type { DragEndEvent } from '@dnd-kit/core';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRef } from 'react';

import { Track } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { defaultDisplay, defaultFeatures } from './defaults';
import { FilterBar } from './FilterBar';
import { useColumns } from './hooks/useColumns';
import { useGlobalFilter } from './hooks/useGlobalFilter';
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
  const resolvedFeatures = {
    ...defaultFeatures,
    ...features,
  };

  const resolvedDisplay = {
    ...defaultDisplay,
    ...display,
  };

  const { sorting, setSorting, isSorted } = useSorting();
  const { onDragStart, onDragEnd } = useReorder<T>({ tracks, onReorder });
  const { globalFilter, setGlobalFilter, globalFilterFn, hasFilter } =
    useGlobalFilter<T>();

  const columns: ColumnDef<T>[] = useColumns<T>({
    display: resolvedDisplay,
    labels,
  });

  const table = useReactTable({
    columns,
    data: tracks,
    state: { sorting, globalFilter },
    enableSortingRemoval: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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

  const isReorderable = Boolean(
    resolvedFeatures?.reorderable && !isSorted && !hasFilter,
  );

  const dndItems = virtualItems.map((v) => rows[v.index].original.source.id);

  return (
    <TrackTableProvider value={{ isReorderable }}>
      {resolvedFeatures?.filterable && (
        <FilterBar
          value={globalFilter}
          onChange={setGlobalFilter}
          className="m-2"
          placeholder="Filter tracks"
        />
      )}
      <div
        ref={scrollParentRef}
        className="relative flex max-h-full overflow-auto"
      >
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
            {resolvedFeatures?.header && (
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    role="row"
                    className="border-border bg-primary border-b-2"
                  >
                    {headerGroup.headers.map((header) =>
                      flexRender(header.column.columnDef.header, {
                        ...header.getContext(),
                        key: header.id,
                      }),
                    )}
                  </tr>
                ))}
              </thead>
            )}
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
