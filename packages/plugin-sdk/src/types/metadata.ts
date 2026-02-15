import type {
  Album,
  AlbumRef,
  ArtistBio,
  ArtistRef,
  ArtistSocialStats,
  PlaylistRef,
  SearchParams,
  SearchResults,
  TrackRef,
} from '@nuclearplayer/model';

export type MetadataHost = {
  search: (params: SearchParams, providerId?: string) => Promise<SearchResults>;
  fetchArtistBio: (artistId: string, providerId?: string) => Promise<ArtistBio>;
  fetchArtistSocialStats: (
    artistId: string,
    providerId?: string,
  ) => Promise<ArtistSocialStats>;
  fetchArtistAlbums: (
    artistId: string,
    providerId?: string,
  ) => Promise<AlbumRef[]>;
  fetchArtistTopTracks: (
    artistId: string,
    providerId?: string,
  ) => Promise<TrackRef[]>;
  fetchArtistPlaylists: (
    artistId: string,
    providerId?: string,
  ) => Promise<PlaylistRef[]>;
  fetchArtistRelatedArtists: (
    artistId: string,
    providerId?: string,
  ) => Promise<ArtistRef[]>;
  fetchAlbumDetails: (albumId: string, providerId?: string) => Promise<Album>;
};
