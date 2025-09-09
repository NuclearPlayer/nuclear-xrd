import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { HashIcon, ImageIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { pickArtwork, Track } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { formatTimeMillis } from '../../utils/time';
import { PositionCell } from './Cells/PositionCell';
import { TextCell } from './Cells/TextCell';
import { ThumbnailCell } from './Cells/ThumbnailCell';
import { IconHeader } from './Headers/IconHeader';
import { TextHeader } from './Headers/TextHeader';
import { mergeLabels } from './labels';
import { SortableRow } from './SortableRow';
import { TrackTableProps } from './types';

const ROW_HEIGHT = 42;

export function TrackTable<T extends Track = Track>({
  tracks,
  labels,
  classes,
  display,
  features,
  onReorder,
}: TrackTableProps<T>) {
  const columnHelper = createColumnHelper<T>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const mergedLabels = useMemo(() => mergeLabels(labels), [labels]);

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

  const columns: ColumnDef<T>[] = useMemo(
    () => [
      display?.displayPosition &&
        columnHelper.accessor((track) => track.trackNumber, {
          id: 'position',
          enableSorting: true,
          header: (context) => <IconHeader Icon={HashIcon} context={context} />,
          cell: PositionCell,
        }),
      display?.displayThumbnail &&
        columnHelper.accessor(
          (track) => pickArtwork(track.artwork, 'thumbnail', 40),
          {
            id: 'thumbnail',
            header: (context) => (
              <IconHeader Icon={ImageIcon} context={context} />
            ),
            cell: ThumbnailCell,
            enableSorting: false,
          },
        ),
      columnHelper.accessor((track) => track.artists[0].name, {
        id: 'artist',
        enableSorting: true,
        header: (context) => (
          <TextHeader context={context}>
            {mergedLabels.headers.artistHeader}
          </TextHeader>
        ),
        cell: TextCell,
      }),
      columnHelper.accessor((track) => track.title, {
        id: 'title',
        enableSorting: true,
        header: (context) => (
          <TextHeader context={context}>
            {mergedLabels.headers.titleHeader}
          </TextHeader>
        ),
        cell: TextCell,
      }),
      display?.displayAlbum &&
        columnHelper.accessor((track) => track.album?.title, {
          id: 'album',
          enableSorting: true,
          header: (context) => (
            <TextHeader context={context}>
              {mergedLabels.headers.albumHeader}
            </TextHeader>
          ),
          cell: TextCell,
        }),
      display?.displayDuration &&
        columnHelper.accessor((track) => formatTimeMillis(track.durationMs), {
          id: 'duration',
          enableSorting: true,
          header: (context) => (
            <TextHeader context={context}>
              {mergedLabels.headers.durationHeader}
            </TextHeader>
          ),
          cell: TextCell,
        }),
    ],
    [mergedLabels],
  ).filter(Boolean) as ColumnDef<T>[];

  const table = useReactTable({
    columns,
    data: tracks,
    state: { sorting },
    enableSortingRemoval: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const isSorted = sorting.length > 0;

  const { rows } = table.getRowModel();
  const colCount = table.getVisibleFlatColumns().length;

  const scrollParentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: tracks.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => scrollParentRef.current,
    overscan: 8,
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
                    style={{ height: ROW_HEIGHT }}
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
