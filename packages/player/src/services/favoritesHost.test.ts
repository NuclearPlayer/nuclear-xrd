import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFavoritesStore } from '../stores/favoritesStore';
import {
  createAlbumRef,
  createArtistRef,
  createProviderRef,
  createTrack,
} from '../test/fixtures/favorites';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { favoritesHost } from './favoritesHost';

describe('favoritesHost', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2025-02-01T00:00:00.000Z'));
    resetInMemoryTauriStore();
    useFavoritesStore.setState({
      tracks: [],
      albums: [],
      artists: [],
      loaded: false,
    });
  });

  it('gets tracks', async () => {
    await useFavoritesStore.getState().addTrack(createTrack('spotify', 't1'));

    const tracks = await favoritesHost.getTracks();

    expect(tracks).toMatchInlineSnapshot(`
      [
        {
          "addedAtIso": "2025-02-01T00:00:00.000Z",
          "ref": {
            "artists": [
              {
                "name": "Test Artist",
                "roles": [],
                "source": {
                  "id": "artist-1",
                  "provider": "test",
                },
              },
            ],
            "source": {
              "id": "t1",
              "provider": "spotify",
            },
            "title": "Track t1",
          },
        },
      ]
    `);
  });

  it('gets albums', async () => {
    await useFavoritesStore
      .getState()
      .addAlbum(createAlbumRef('spotify', 'a1'));

    const albums = await favoritesHost.getAlbums();

    expect(albums).toMatchInlineSnapshot(`
      [
        {
          "addedAtIso": "2025-02-01T00:00:00.000Z",
          "ref": {
            "source": {
              "id": "a1",
              "provider": "spotify",
            },
            "title": "Album a1",
          },
        },
      ]
    `);
  });

  it('gets artists', async () => {
    await useFavoritesStore
      .getState()
      .addArtist(createArtistRef('spotify', 'ar1'));

    const artists = await favoritesHost.getArtists();

    expect(artists).toMatchInlineSnapshot(`
      [
        {
          "addedAtIso": "2025-02-01T00:00:00.000Z",
          "ref": {
            "name": "Artist ar1",
            "source": {
              "id": "ar1",
              "provider": "spotify",
            },
          },
        },
      ]
    `);
  });

  it('adds and removes a track', async () => {
    const trackRef = createTrack('spotify', 't1');

    await favoritesHost.addTrack(trackRef);
    expect(await favoritesHost.isTrackFavorite(trackRef.source)).toBe(true);

    await favoritesHost.removeTrack(trackRef.source);
    expect(await favoritesHost.isTrackFavorite(trackRef.source)).toBe(false);
  });

  it('adds and removes an album', async () => {
    const albumRef = createAlbumRef('spotify', 'a1');

    await favoritesHost.addAlbum(albumRef);
    expect(await favoritesHost.isAlbumFavorite(albumRef.source)).toBe(true);

    await favoritesHost.removeAlbum(albumRef.source);
    expect(await favoritesHost.isAlbumFavorite(albumRef.source)).toBe(false);
  });

  it('adds and removes an artist', async () => {
    const artistRef = createArtistRef('spotify', 'ar1');

    await favoritesHost.addArtist(artistRef);
    expect(await favoritesHost.isArtistFavorite(artistRef.source)).toBe(true);

    await favoritesHost.removeArtist(artistRef.source);
    expect(await favoritesHost.isArtistFavorite(artistRef.source)).toBe(false);
  });

  it('checks favorite status with ProviderRef', async () => {
    await favoritesHost.addTrack(createTrack('spotify', 't1'));

    expect(
      await favoritesHost.isTrackFavorite(createProviderRef('spotify', 't1')),
    ).toBe(true);
    expect(
      await favoritesHost.isTrackFavorite(createProviderRef('spotify', 't2')),
    ).toBe(false);
  });

  it('subscribes to changes', async () => {
    const listener = vi.fn();
    const unsubscribe = favoritesHost.subscribe(listener);

    await favoritesHost.addTrack(createTrack('spotify', 't1'));

    expect(listener).toHaveBeenCalled();
    const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0];
    expect(lastCall.tracks).toMatchInlineSnapshot(`
      [
        {
          "addedAtIso": "2025-02-01T00:00:00.000Z",
          "ref": {
            "artists": [
              {
                "name": "Test Artist",
                "roles": [],
                "source": {
                  "id": "artist-1",
                  "provider": "test",
                },
              },
            ],
            "source": {
              "id": "t1",
              "provider": "spotify",
            },
            "title": "Track t1",
          },
        },
      ]
    `);

    unsubscribe();
  });
});
