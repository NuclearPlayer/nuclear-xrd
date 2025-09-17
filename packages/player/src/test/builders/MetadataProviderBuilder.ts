import { MetadataProvider } from '@nuclearplayer/plugin-sdk';

export class MetadataProviderBuilder {
  private provider: MetadataProvider;

  constructor() {
    this.provider = {
      id: 'test-metadata-provider',
      kind: 'metadata',
      name: 'Test Metadata Provider',
    };
  }

  withId(id: MetadataProvider['id']): this {
    this.provider.id = id;
    return this;
  }

  withKind(kind: MetadataProvider['kind']): this {
    this.provider.kind = kind;
    return this;
  }

  withName(name: MetadataProvider['name']): this {
    this.provider.name = name;
    return this;
  }

  withSearchCapabilities(
    searchCapabilities: MetadataProvider['searchCapabilities'],
  ): this {
    this.provider.searchCapabilities = searchCapabilities;
    return this;
  }

  withArtistMetadataCapabilities(
    artistMetadataCapabilities: MetadataProvider['artistMetadataCapabilities'],
  ): this {
    this.provider.artistMetadataCapabilities = artistMetadataCapabilities;
    return this;
  }

  withSearch(search: MetadataProvider['search']): this {
    this.provider.search = search;
    return this;
  }

  withSearchArtists(searchArtists: MetadataProvider['searchArtists']): this {
    this.provider.searchArtists = searchArtists;
    return this;
  }

  withSearchAlbums(searchAlbums: MetadataProvider['searchAlbums']): this {
    this.provider.searchAlbums = searchAlbums;
    return this;
  }

  withSearchTracks(searchTracks: MetadataProvider['searchTracks']): this {
    this.provider.searchTracks = searchTracks;
    return this;
  }

  withSearchPlaylists(
    searchPlaylists: MetadataProvider['searchPlaylists'],
  ): this {
    this.provider.searchPlaylists = searchPlaylists;
    return this;
  }

  withFetchArtistDetails(
    fetchArtistDetails: MetadataProvider['fetchArtistDetails'],
  ): this {
    this.provider.fetchArtistDetails = fetchArtistDetails;
    return this;
  }

  withFetchArtistAlbums(
    fetchArtistAlbums: MetadataProvider['fetchArtistAlbums'],
  ): this {
    this.provider.fetchArtistAlbums = fetchArtistAlbums;
    return this;
  }

  withFetchArtistTopTracks(
    fetchArtistTopTracks: MetadataProvider['fetchArtistTopTracks'],
  ): this {
    this.provider.fetchArtistTopTracks = fetchArtistTopTracks;
    return this;
  }

  withFetchArtistRelatedArtists(
    fetchArtistRelatedArtists: MetadataProvider['fetchArtistRelatedArtists'],
  ): this {
    this.provider.fetchArtistRelatedArtists = fetchArtistRelatedArtists;
    return this;
  }

  build(): MetadataProvider {
    return this.provider;
  }
}
