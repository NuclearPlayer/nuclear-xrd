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
  useReactTable,
} from '@tanstack/react-table';
import { HashIcon, ImageIcon } from 'lucide-react';
import { useMemo } from 'react';

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

export function TrackTable<T extends Track = Track>({
  tracks,
  labels,
  classes,
  display,
  features,
  onReorder,
}: TrackTableProps<T>) {
  const columnHelper = createColumnHelper<T>();
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
          header: () => <IconHeader Icon={HashIcon} />,
          cell: PositionCell,
        }),
      display?.displayThumbnail &&
        columnHelper.accessor(
          (track) => pickArtwork(track.artwork, 'thumbnail', 40),
          {
            id: 'thumbnail',
            header: () => <IconHeader Icon={ImageIcon} />,
            cell: ThumbnailCell,
          },
        ),
      columnHelper.accessor((track) => track.artists[0].name, {
        id: 'artist',
        header: () => (
          <TextHeader>{mergedLabels.headers.artistHeader}</TextHeader>
        ),
        cell: TextCell,
      }),
      columnHelper.accessor((track) => track.title, {
        id: 'title',
        header: () => (
          <TextHeader>{mergedLabels.headers.titleHeader}</TextHeader>
        ),
        cell: TextCell,
      }),
      display?.displayAlbum &&
        columnHelper.accessor((track) => track.album?.title, {
          id: 'album',
          header: () => (
            <TextHeader>{mergedLabels.headers.albumHeader}</TextHeader>
          ),
          cell: TextCell,
        }),
      display?.displayDuration &&
        columnHelper.accessor((track) => formatTimeMillis(track.durationMs), {
          id: 'duration',
          header: () => (
            <TextHeader>{mergedLabels.headers.durationHeader}</TextHeader>
          ),
          cell: TextCell,
        }),
    ],
    [mergedLabels],
  ).filter(Boolean) as ColumnDef<T>[];

  const table = useReactTable({
    columns,
    data: tracks,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
            {table.getRowModel().rows.map((row) => (
              <SortableRow
                key={row.original.source.id}
                row={row}
                isReorderable={features?.reorderable}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}
