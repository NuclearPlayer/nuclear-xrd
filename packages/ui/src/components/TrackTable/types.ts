import { Track } from '@nuclearplayer/model';

export interface TrackTableLabels {
  playNow: string;
  addToQueue: string;
  playNext: string;
  favorite: string;
  unfavorite: string;
  contextMenu: string;
  selectAll: string;
  reorderUnavailableDueToSort: string;
  reorderUnavailableDueToFilter: string;
  keyboardInstructions: string;
  dragHandleLabel: string;
}

export interface TrackTableProps<T extends Track = Track> {
  tracks: T[];
  customColumns?: unknown[];
  features?: {
    header?: boolean;
    filterable?: boolean;
    sortable?: boolean;
    selectable?: boolean;
    reorderable?: boolean;
    favorites?: boolean;
    contextMenu?: boolean;
  };
  display?: {
    displayDeleteButton?: boolean;
    displayPosition?: boolean;
    displayThumbnail?: boolean;
    displayFavorite?: boolean;
    displayArtist?: boolean;
    displayAlbum?: boolean;
    displayDuration?: boolean;
  };
  onReorder?: (ids: string[]) => void;
  onPlayNow?: (track: T) => void;
  onPlayNext?: (track: T) => void;
  onAddToQueue?: (track: T) => void;
  onToggleFavorite?: (track: T, next: boolean) => void;
  onDelete?: (track: T) => void;
  onOpenAlbum?: (track: T) => void;
  onOpenArtist?: (track: T) => void;
  onContextMenuAction?: (actionId: string, track: T | T[]) => void;
  onVisibleRangeChange?: (range: { start: number; end: number }) => void;
  onRowDoubleClick?: (track: T) => void;
  bulkActions?: {
    onPlaySelected?: (tracks: T[]) => void;
    onAddSelectedToQueue?: (tracks: T[]) => void;
    onToggleFavoriteSelected?: (tracks: T[], next: boolean) => void;
  };
  rowHeight?: number;
  overscan?: number;
  className?: string;
  labels?: Partial<TrackTableLabels>;
  'aria-label'?: string;
}
