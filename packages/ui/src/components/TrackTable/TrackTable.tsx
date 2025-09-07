import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

import { pickArtwork, Track } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { formatTimeMillis } from '../../utils/time';
import { TextCell } from './Cells/TextCell';
import { ThumbnailCell } from './Cells/ThumbnailCell';
import { mergeLabels } from './labels';
import { TrackTableProps } from './types';

export function TrackTable<T extends Track = Track>({
  tracks,
  labels,
  classes,
  'aria-label': ariaLabel,
  display,
}: TrackTableProps<T>) {
  const columnHelper = createColumnHelper<T>();
  const mergedLabels = useMemo(() => mergeLabels(labels), [labels]);

  const columns: ColumnDef<T>[] = useMemo(
    () => [
      display?.displayPosition &&
        columnHelper.accessor((track) => track.trackNumber, {
          id: 'position',
          header: () => mergedLabels.headers.positionHeader,
          cell: TextCell,
        }),
      display?.displayThumbnail &&
        columnHelper.accessor(
          (track) => pickArtwork(track.artwork, 'thumbnail', 40),
          {
            id: 'thumbnail',
            header: () => mergedLabels.headers.thumbnailHeader,
            cell: ThumbnailCell,
          },
        ),
      columnHelper.accessor((track) => track.artists[0].name, {
        header: mergedLabels.headers.artistHeader,
        cell: TextCell,
      }),
      columnHelper.accessor((track) => track.title, {
        header: mergedLabels.headers.titleHeader,
        cell: TextCell,
      }),
      display?.displayAlbum &&
        columnHelper.accessor((track) => track.album?.title, {
          header: mergedLabels.headers.albumHeader,
          cell: TextCell,
        }),
      display?.displayDuration &&
        columnHelper.accessor((track) => formatTimeMillis(track.durationMs), {
          header: mergedLabels.headers.durationHeader,
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
    <table role="grid" className={cn('relative w-full', classes?.root)}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} role="row">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                role="columnheader"
                className="border-b py-2 text-left font-medium"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} role="row">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} role="gridcell" className="border-b">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
