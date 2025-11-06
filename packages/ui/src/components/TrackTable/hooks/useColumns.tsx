import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { HashIcon, ImageIcon } from 'lucide-react';
import { useMemo } from 'react';

import { pickArtwork, Track } from '@nuclearplayer/model';

import { formatTimeMillis } from '../../../utils/time';
import { PositionCell } from '../Cells/PositionCell';
import { TextCell } from '../Cells/TextCell';
import { ThumbnailCell } from '../Cells/ThumbnailCell';
import { TitleCell } from '../Cells/TitleCell';
import { IconHeader } from '../Headers/IconHeader';
import { TextHeader } from '../Headers/TextHeader';
import { mergeLabels } from '../labels';
import { TrackTableProps } from '../types';

export function useColumns<T extends Track = Track>(
  props: Pick<TrackTableProps<T>, 'display' | 'labels'>,
): ColumnDef<T>[] {
  const { display, labels } = props;
  const columnHelper = createColumnHelper<T>();
  const mergedLabels = useMemo(() => mergeLabels(labels), [labels]);

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
        cell: TitleCell,
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
    [mergedLabels, display],
  ).filter(Boolean) as ColumnDef<T>[];

  return columns;
}
