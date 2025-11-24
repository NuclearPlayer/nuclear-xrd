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
  search: (params: SearchParams, providerId?: string) => Promise<SearchResults>;
  fetchArtistDetails: (
    artistId: string,
    providerId?: string,
  ) => Promise<Artist>;
  fetchArtistAlbums: (
    artistId: string,
    providerId?: string,
  ) => Promise<AlbumRef[]>;
  fetchArtistTopTracks: (
    artistId: string,
    providerId?: string,
  ) => Promise<TrackRef[]>;
  fetchArtistRelatedArtists: (
    artistId: string,
    providerId?: string,
  ) => Promise<ArtistRef[]>;
  fetchAlbumDetails: (albumId: string, providerId?: string) => Promise<Album>;
};
