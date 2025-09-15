import { describe, expect, it, vi } from 'vitest';

import { MetadataProviderBuilder } from '../../test/builders/MetadataProviderBuilder';
import { executeMetadataSearch } from './executeMetadataSearch';

describe('executeMetadataSearch', () => {
  it('calls unified search when capability present', async () => {
    const search = vi.fn().mockResolvedValue({
      tracks: ['track 1'],
      artists: ['artist 1'],
      albums: ['album 1'],
      playlists: ['playlist 1'],
    });

    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities(['unified'])
      .withSearch(search)
      .build();

    const res = await executeMetadataSearch(provider, { query: 'radiohead' });
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith({ query: 'radiohead' });
    expect(res).toEqual({
      tracks: ['track 1'],
      artists: ['artist 1'],
      albums: ['album 1'],
      playlists: ['playlist 1'],
    });
  });

  it('dispatches to category methods when unified is not available', async () => {
    const searchArtists = vi.fn().mockResolvedValue(['a1']);
    const searchAlbums = vi.fn().mockResolvedValue(['al1']);
    const searchTracks = vi.fn().mockResolvedValue(['t1']);
    const searchPlaylists = vi.fn().mockResolvedValue(['p1']);

    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities(['artists', 'albums', 'tracks', 'playlists'])
      .withSearchArtists(searchArtists)
      .withSearchAlbums(searchAlbums)
      .withSearchTracks(searchTracks)
      .withSearchPlaylists(searchPlaylists)
      .build();

    const res = await executeMetadataSearch(provider, { query: 'daft punk' });

    expect(searchArtists).toHaveBeenCalledWith({
      query: 'daft punk',
      limit: undefined,
    });
    expect(searchAlbums).toHaveBeenCalledWith({
      query: 'daft punk',
      limit: undefined,
    });
    expect(searchTracks).toHaveBeenCalledWith({
      query: 'daft punk',
      limit: undefined,
    });
    expect(searchPlaylists).toHaveBeenCalledWith({
      query: 'daft punk',
      limit: undefined,
    });

    expect(res).toEqual({
      tracks: ['t1'],
      artists: ['a1'],
      albums: ['al1'],
      playlists: ['p1'],
    });
  });

  it('respects requested types subset', async () => {
    const searchArtists = vi.fn();
    const searchAlbums = vi.fn();
    const searchTracks = vi.fn();
    const searchPlaylists = vi.fn();

    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities(['artists', 'albums', 'tracks', 'playlists'])
      .withSearchArtists(searchArtists)
      .withSearchAlbums(searchAlbums)
      .withSearchTracks(searchTracks)
      .withSearchPlaylists(searchPlaylists)
      .build();

    await executeMetadataSearch(provider, {
      query: 'foo',
      types: ['artists', 'albums'],
    });

    expect(searchArtists).toHaveBeenCalledTimes(1);
    expect(searchAlbums).toHaveBeenCalledTimes(1);
    expect(searchTracks).not.toHaveBeenCalled();
    expect(searchPlaylists).not.toHaveBeenCalled();
  });

  it('does not call any category methods when types is an empty array', async () => {
    const searchArtists = vi.fn();
    const searchAlbums = vi.fn();
    const searchTracks = vi.fn();
    const searchPlaylists = vi.fn();

    const provider = new MetadataProviderBuilder()
      .withSearchCapabilities(['artists', 'albums', 'tracks', 'playlists'])
      .withSearchArtists(searchArtists)
      .withSearchAlbums(searchAlbums)
      .withSearchTracks(searchTracks)
      .withSearchPlaylists(searchPlaylists)
      .build();

    const res = await executeMetadataSearch(provider, {
      query: 'bar',
      types: [],
    });

    expect(searchArtists).not.toHaveBeenCalled();
    expect(searchAlbums).not.toHaveBeenCalled();
    expect(searchTracks).not.toHaveBeenCalled();
    expect(searchPlaylists).not.toHaveBeenCalled();
    expect(res).toEqual({});
  });
});
