import { MarketplacePlugin } from '../../apis/pluginMarketplaceApi';

export const fakePluginManifest = JSON.stringify({
  name: 'nuclear-fake-plugin',
  version: '0.1.0',
  description: 'Fake plugin for testing',
  main: 'index.ts',
  license: 'AGPL-3.0-only',
  author: 'nukeop',
  keywords: ['nuclear', 'test'],
  nuclear: {
    displayName: 'Fake plugin',
    category: 'Robbing ships on the high seas',
    icon: {
      type: 'link',
      link: 'https://example.com/icon.png',
    },
    permissions: [],
  },
});

export const fakeMarketplacePlugins: MarketplacePlugin[] = [
  {
    id: 'nuclear-youtube-plugin',
    name: 'YouTube Music',
    description: 'Stream music from YouTube',
    author: 'nukeop',
    repo: 'NuclearPlayer/nuclear-youtube-plugin',
    category: 'streaming',
    addedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'nuclear-lastfm-plugin',
    name: 'Last.fm Scrobbler',
    description: 'Scrobble your listening history to Last.fm',
    author: 'nukeop',
    repo: 'NuclearPlayer/nuclear-lastfm-plugin',
    category: 'scrobbling',
    addedAt: '2026-02-20T00:00:00Z',
  },
  {
    id: 'nuclear-musicbrainz-plugin',
    name: 'MusicBrainz Metadata',
    description: 'Fetch metadata from MusicBrainz database',
    author: 'nukeop',
    repo: 'NuclearPlayer/nuclear-musicbrainz-plugin',
    category: 'metadata',
    addedAt: '2026-03-10T00:00:00Z',
  },
];
