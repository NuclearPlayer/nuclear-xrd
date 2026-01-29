import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createAlbumRef,
  createArtistRef,
  createProviderRef,
  createTrackRef,
} from '../test/fixtures/favorites';
import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { initializeFavoritesStore, useFavoritesStore } from './favoritesStore';

const MOCK_ISO_DATE = '2025-02-01T00:00:00.000Z';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    const date = new Date(MOCK_ISO_DATE);
    vi.setSystemTime(date);
    resetInMemoryTauriStore();
    useFavoritesStore.setState({
      tracks: [],
      albums: [],
      artists: [],
      loaded: false,
    });
  });

  describe('initial state', () => {
    it('starts with empty arrays and loaded: false', () => {
      const state = useFavoritesStore.getState();
      expect(state.tracks).toEqual([]);
      expect(state.albums).toEqual([]);
      expect(state.artists).toEqual([]);
      expect(state.loaded).toBe(false);
    });
  });

  describe('tracks', () => {
    describe('addTrack', () => {
      it('adds a track with timestamp', async () => {
        const trackRef = createTrackRef('spotify', 'track-1');
        await useFavoritesStore.getState().addTrack(trackRef);

        const state = useFavoritesStore.getState();
        expect(state.tracks).toHaveLength(1);
        expect(state.tracks[0].ref).toEqual(trackRef);
        expect(state.tracks[0].addedAtIso).toBe(MOCK_ISO_DATE);
      });

      it('does not add duplicate (same provider + id)', async () => {
        const trackRef1 = createTrackRef('spotify', 'track-1');
        const trackRef2 = createTrackRef('spotify', 'track-1');
        trackRef2.title = 'Different Title';

        await useFavoritesStore.getState().addTrack(trackRef1);
        await useFavoritesStore.getState().addTrack(trackRef2);

        const state = useFavoritesStore.getState();
        expect(state.tracks).toHaveLength(1);
        expect(state.tracks[0].ref.title).toBe('Track track-1');
      });

      it('allows same id from different provider', async () => {
        const trackRef1 = createTrackRef('spotify', 'track-1');
        const trackRef2 = createTrackRef('youtube', 'track-1');

        await useFavoritesStore.getState().addTrack(trackRef1);
        await useFavoritesStore.getState().addTrack(trackRef2);

        const state = useFavoritesStore.getState();
        expect(state.tracks).toHaveLength(2);
      });
    });

    describe('removeTrack', () => {
      it('removes by provider + id', async () => {
        const trackRef = createTrackRef('spotify', 'track-1');
        await useFavoritesStore.getState().addTrack(trackRef);

        await useFavoritesStore
          .getState()
          .removeTrack(createProviderRef('spotify', 'track-1'));

        const state = useFavoritesStore.getState();
        expect(state.tracks).toHaveLength(0);
      });

      it('does nothing if not found', async () => {
        const trackRef = createTrackRef('spotify', 'track-1');
        await useFavoritesStore.getState().addTrack(trackRef);

        await useFavoritesStore
          .getState()
          .removeTrack(createProviderRef('spotify', 'track-2'));

        const state = useFavoritesStore.getState();
        expect(state.tracks).toHaveLength(1);
      });

      it('matches only provider + id, ignoring other fields', async () => {
        const trackRef = createTrackRef('spotify', 'track-1');
        await useFavoritesStore.getState().addTrack(trackRef);

        await useFavoritesStore.getState().removeTrack({
          provider: 'spotify',
          id: 'track-1',
          url: 'https://example.com/different-url',
        });

        const state = useFavoritesStore.getState();
        expect(state.tracks).toHaveLength(0);
      });
    });

    describe('isTrackFavorite', () => {
      it('returns true when track is favorite', async () => {
        const trackRef = createTrackRef('spotify', 'track-1');
        await useFavoritesStore.getState().addTrack(trackRef);

        const result = useFavoritesStore
          .getState()
          .isTrackFavorite(createProviderRef('spotify', 'track-1'));

        expect(result).toBe(true);
      });

      it('returns false when track is not favorite', () => {
        const result = useFavoritesStore
          .getState()
          .isTrackFavorite(createProviderRef('spotify', 'track-1'));

        expect(result).toBe(false);
      });

      it('matches only provider + id', async () => {
        const trackRef = createTrackRef('spotify', 'track-1');
        await useFavoritesStore.getState().addTrack(trackRef);

        const result = useFavoritesStore.getState().isTrackFavorite({
          provider: 'spotify',
          id: 'track-1',
          url: 'https://different-url.com',
        });

        expect(result).toBe(true);
      });
    });
  });

  describe('albums', () => {
    it('adds an album with timestamp', async () => {
      const albumRef = createAlbumRef('spotify', 'album-1');
      await useFavoritesStore.getState().addAlbum(albumRef);

      const state = useFavoritesStore.getState();
      expect(state.albums).toHaveLength(1);
      expect(state.albums[0].ref).toEqual(albumRef);
      expect(state.albums[0].addedAtIso).toBe(MOCK_ISO_DATE);
    });

    it('does not add duplicate album', async () => {
      const albumRef = createAlbumRef('spotify', 'album-1');
      await useFavoritesStore.getState().addAlbum(albumRef);
      await useFavoritesStore.getState().addAlbum(albumRef);

      const state = useFavoritesStore.getState();
      expect(state.albums).toHaveLength(1);
    });

    it('removes album by provider + id', async () => {
      const albumRef = createAlbumRef('spotify', 'album-1');
      await useFavoritesStore.getState().addAlbum(albumRef);

      await useFavoritesStore
        .getState()
        .removeAlbum(createProviderRef('spotify', 'album-1'));

      const state = useFavoritesStore.getState();
      expect(state.albums).toHaveLength(0);
    });

    it('removeAlbum does nothing if not found', async () => {
      const albumRef = createAlbumRef('spotify', 'album-1');
      await useFavoritesStore.getState().addAlbum(albumRef);

      await useFavoritesStore
        .getState()
        .removeAlbum(createProviderRef('spotify', 'album-2'));

      const state = useFavoritesStore.getState();
      expect(state.albums).toHaveLength(1);
    });

    it('isAlbumFavorite returns correct value', async () => {
      const albumRef = createAlbumRef('spotify', 'album-1');
      await useFavoritesStore.getState().addAlbum(albumRef);

      expect(
        useFavoritesStore
          .getState()
          .isAlbumFavorite(createProviderRef('spotify', 'album-1')),
      ).toBe(true);

      expect(
        useFavoritesStore
          .getState()
          .isAlbumFavorite(createProviderRef('spotify', 'album-2')),
      ).toBe(false);
    });
  });

  describe('artists', () => {
    it('adds an artist with timestamp', async () => {
      const artistRef = createArtistRef('spotify', 'artist-1');
      await useFavoritesStore.getState().addArtist(artistRef);

      const state = useFavoritesStore.getState();
      expect(state.artists).toHaveLength(1);
      expect(state.artists[0].ref).toEqual(artistRef);
      expect(state.artists[0].addedAtIso).toBe(MOCK_ISO_DATE);
    });

    it('does not add duplicate artist', async () => {
      const artistRef = createArtistRef('spotify', 'artist-1');
      await useFavoritesStore.getState().addArtist(artistRef);
      await useFavoritesStore.getState().addArtist(artistRef);

      const state = useFavoritesStore.getState();
      expect(state.artists).toHaveLength(1);
    });

    it('removes artist by provider + id', async () => {
      const artistRef = createArtistRef('spotify', 'artist-1');
      await useFavoritesStore.getState().addArtist(artistRef);

      await useFavoritesStore
        .getState()
        .removeArtist(createProviderRef('spotify', 'artist-1'));

      const state = useFavoritesStore.getState();
      expect(state.artists).toHaveLength(0);
    });

    it('removeArtist does nothing if not found', async () => {
      const artistRef = createArtistRef('spotify', 'artist-1');
      await useFavoritesStore.getState().addArtist(artistRef);

      await useFavoritesStore
        .getState()
        .removeArtist(createProviderRef('spotify', 'artist-2'));

      const state = useFavoritesStore.getState();
      expect(state.artists).toHaveLength(1);
    });

    it('isArtistFavorite returns correct value', async () => {
      const artistRef = createArtistRef('spotify', 'artist-1');
      await useFavoritesStore.getState().addArtist(artistRef);

      expect(
        useFavoritesStore
          .getState()
          .isArtistFavorite(createProviderRef('spotify', 'artist-1')),
      ).toBe(true);

      expect(
        useFavoritesStore
          .getState()
          .isArtistFavorite(createProviderRef('spotify', 'artist-2')),
      ).toBe(false);
    });
  });

  describe('persistence', () => {
    it('loadFromDisk restores state and sets loaded: true', async () => {
      const trackRef = createTrackRef('spotify', 'track-1');
      const albumRef = createAlbumRef('spotify', 'album-1');
      const artistRef = createArtistRef('spotify', 'artist-1');

      await useFavoritesStore.getState().addTrack(trackRef);
      await useFavoritesStore.getState().addAlbum(albumRef);
      await useFavoritesStore.getState().addArtist(artistRef);

      await new Promise((resolve) => setTimeout(resolve, 10));

      useFavoritesStore.setState({
        tracks: [],
        albums: [],
        artists: [],
        loaded: false,
      });

      await initializeFavoritesStore();

      const state = useFavoritesStore.getState();
      expect(state.tracks).toHaveLength(1);
      expect(state.tracks[0].ref.title).toBe('Track track-1');
      expect(state.albums).toHaveLength(1);
      expect(state.albums[0].ref.title).toBe('Album album-1');
      expect(state.artists).toHaveLength(1);
      expect(state.artists[0].ref.name).toBe('Artist artist-1');
      expect(state.loaded).toBe(true);
    });

    it('changes survive reload', async () => {
      const trackRef = createTrackRef('spotify', 'track-1');
      await useFavoritesStore.getState().addTrack(trackRef);

      await useFavoritesStore
        .getState()
        .removeTrack(createProviderRef('spotify', 'track-1'));

      await new Promise((resolve) => setTimeout(resolve, 10));

      useFavoritesStore.setState({
        tracks: [],
        albums: [],
        artists: [],
        loaded: false,
      });

      await initializeFavoritesStore();

      const state = useFavoritesStore.getState();
      expect(state.tracks).toHaveLength(0);
    });
  });
});
