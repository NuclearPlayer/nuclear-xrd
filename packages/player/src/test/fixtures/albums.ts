import type { Album, TrackRef } from '@nuclearplayer/model';

type AlbumFixtureOptions = {
  artistName: string;
  albumTitle: string;
  trackTitles: string[];
  providerId?: string;
};

export const createAlbumFixture = ({
  artistName,
  albumTitle,
  trackTitles,
  providerId = 'test-metadata-provider',
}: AlbumFixtureOptions): Album => {
  const artistSource = { provider: providerId, id: 'artist-1' };

  const tracks: TrackRef[] = trackTitles.map((title, index) => ({
    title,
    artists: [
      {
        name: artistName,
        source: artistSource,
      },
    ],
    source: { provider: providerId, id: `track-${index + 1}` },
  }));

  return {
    title: albumTitle,
    artists: [{ name: artistName, roles: [] }],
    tracks,
    source: { provider: providerId, id: 'album-1' },
  };
};

export const GIANT_STEPS = createAlbumFixture({
  artistName: 'John Coltrane',
  albumTitle: 'Giant Steps',
  trackTitles: ['Countdown', 'Giant Steps', 'Spiral'],
});
