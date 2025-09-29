import { TrackTableProps } from './types';

export const defaultFeatures: TrackTableProps['features'] = {
  header: true,
  filterable: true,
  sortable: true,
  reorderable: false,
  favorites: true,
  contextMenu: true,
};
export const defaultDisplay: TrackTableProps['display'] = {
  displayDeleteButton: false,
  displayPosition: false,
  displayThumbnail: true,
  displayFavorite: true,
  displayArtist: true,
  displayDuration: true,
};
