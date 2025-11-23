import type {
  Album,
  AlbumRef,
  Artist,
  ArtistRef,
  SearchParams,
  SearchResults,
  TrackRef,
} from '@nuclearplayer/model';

export type MetadataHost = {
  search: (params: SearchParams) => Promise<SearchResults>;
  fetchArtistDetails: (artistId: string) => Promise<Artist>;
  fetchArtistAlbums: (artistId: string) => Promise<AlbumRef[]>;
  fetchArtistTopTracks: (artistId: string) => Promise<TrackRef[]>;
  fetchArtistRelatedArtists: (artistId: string) => Promise<ArtistRef[]>;
  fetchAlbumDetails: (albumId: string) => Promise<Album>;
};
