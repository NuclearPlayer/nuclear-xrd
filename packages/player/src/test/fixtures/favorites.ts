import type {
  AlbumRef,
  ArtistRef,
  ProviderRef,
  Track,
} from '@nuclearplayer/model';

export const createTrack = (provider: string, id: string): Track => ({
  title: `Track ${id}`,
  artists: [
    {
      name: 'Test Artist',
      roles: [],
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
