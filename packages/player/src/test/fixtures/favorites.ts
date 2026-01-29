import type {
  AlbumRef,
  ArtistRef,
  ProviderRef,
  TrackRef,
} from '@nuclearplayer/model';

export const createTrackRef = (provider: string, id: string): TrackRef => ({
  title: `Track ${id}`,
  artists: [
    {
      name: 'Test Artist',
      source: { provider: 'test', id: 'artist-1' },
    },
  ],
  source: { provider, id },
});

export const createAlbumRef = (provider: string, id: string): AlbumRef => ({
  title: `Album ${id}`,
  source: { provider, id },
});

export const createArtistRef = (provider: string, id: string): ArtistRef => ({
  name: `Artist ${id}`,
  source: { provider, id },
});

export const createProviderRef = (
  provider: string,
  id: string,
): ProviderRef => ({
  provider,
  id,
});
