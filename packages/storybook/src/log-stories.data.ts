import { LogEntryData } from '@nuclearplayer/ui';

export const allVariantEntries: LogEntryData[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 0),
    level: 'error',
    target: 'nuclear::plugin::spotify',
    source: { type: 'plugin', scope: 'spotify' },
    message: 'Authentication failed: Invalid credentials',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000),
    level: 'warn',
    target: 'nuclear::http',
    source: { type: 'core', scope: 'http' },
    message: 'Rate limited, backing off for 5s',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 2000),
    level: 'info',
    target: 'nuclear::app',
    source: { type: 'core', scope: 'app' },
    message: 'Application started',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 3000),
    level: 'debug',
    target: 'nuclear::plugin::youtube_music',
    source: { type: 'plugin', scope: 'youtube-music' },
    message: 'Searching for: Artist - Track Title',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 4000),
    level: 'trace',
    target: 'nuclear::playback',
    source: { type: 'core', scope: 'playback' },
    message: 'Audio buffer: 45.2s remaining',
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 5000),
    level: 'error',
    target: 'nuclear::plugins',
    source: { type: 'core', scope: 'plugins' },
    message: `Plugin failed to load: youtube-music
Error: Cannot read property 'search' of undefined
    at PluginLoader.load (plugin-loader.ts:45)
    at async loadAllPlugins (index.ts:12)`,
  },
];

export const longSingleLineEntry: LogEntryData = {
  id: 'long-json-1',
  timestamp: new Date(),
  level: 'debug',
  target: 'tauri_plugin_updater::updater',
  source: { type: 'core', scope: 'updater' },
  message:
    'parsed release response RemoteRelease { version: Version { major: 1, minor: 6, patch: 2 }, notes: Some("Nuclear Player release v1.6.2"), pub_date: Some(2026-02-20 1:57:34.261 +00:00:00), data: Static { platforms: {"windows-x86_64": ReleaseManifestPlatform { url: Url { scheme: "https", cannot_be_a_base: false, username: "", password: None, host: Some(Domain("github.com")), port: None, path: "/NuclearPlayer/nuclear-xrd/releases/download/player%401.6.2/nuclear-music-player_1.6.2_x64_en-US.msi", query: None, fragment: None }, signature: "dW50cnVzdGVkIGNvbW1lbnQ6..." }, "darwin-aarch64": ReleaseManifestPlatform { url: Url { scheme: "https", cannot_be_a_base: false, username: "", password: None, host: Some(Domain("github.com")), port: None, path: "/NuclearPlayer/nuclear-xrd/releases/download/player%401.6.2/nuclear-music-player_aarch64.app.tar.gz", query: None, fragment: None }, signature: "dW50cnVzdGVkIGNvbW1lbnQ6..." } } }',
};

export const collapsibleEntry: LogEntryData = {
  id: 'collapsible-1',
  timestamp: new Date(),
  level: 'error',
  target: 'nuclear::plugin::youtube_music',
  source: { type: 'plugin', scope: 'youtube-music' },
  message: `Unhandled error in plugin lifecycle hook "onTrackChange"
TypeError: Cannot read properties of undefined (reading 'videoId')
    at YoutubePlugin.resolveStream (youtube-music.ts:142:28)
    at StreamResolver.resolve (stream-resolver.ts:87:15)
    at async PlaybackController.play (playback.ts:56:22)
    at async QueueManager.playNext (queue.ts:134:9)
    at async App.handleTrackEnd (app.ts:201:5)

Context:
  Track: "Radiohead - Everything In Its Right Place"
  Queue position: 3 of 12
  Plugin version: 1.4.2
  Last successful resolve: 2m 14s ago

This error has occurred 3 times in the last 5 minutes.
Consider restarting the plugin or checking for updates.`,
};

export const longMessageLogs: LogEntryData[] = [
  {
    id: '1',
    timestamp: new Date(),
    level: 'error',
    target: 'nuclear::plugins',
    source: { type: 'core', scope: 'plugins' },
    message: `Plugin failed to load: youtube-music
Error: Cannot read property 'search' of undefined
    at PluginLoader.load (plugin-loader.ts:45)
    at async loadAllPlugins (index.ts:12)
    at async App.initialize (app.ts:23)
    at async bootstrap (main.ts:8)

Caused by: NetworkError
    at HttpClient.fetch (http.ts:92)
    at PluginRegistry.resolve (registry.ts:34)
    at PluginLoader.downloadManifest (plugin-loader.ts:31)
    at PluginLoader.load (plugin-loader.ts:42)

Plugin state at time of failure:
  - Name: youtube-music
  - Version: 1.4.2
  - Status: initializing
  - Last successful load: 2025-02-19T14:23:01.000Z`,
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000),
    level: 'debug',
    target: 'nuclear::http',
    source: { type: 'core', scope: 'http' },
    message: `HTTP Response (200 OK) from api.deezer.com/search/track?q=radiohead:
{
  "data": [
    {
      "id": 3135556,
      "title": "Creep",
      "artist": { "name": "Radiohead" },
      "album": { "title": "Pablo Honey" },
      "duration": 238,
      "preview": "https://cdns-preview.dzcdn.net/stream/..."
    },
    {
      "id": 3135557,
      "title": "Karma Police",
      "artist": { "name": "Radiohead" },
      "album": { "title": "OK Computer" },
      "duration": 264
    }
  ],
  "total": 142,
  "next": "https://api.deezer.com/search/track?q=radiohead&index=25"
}`,
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 2000),
    level: 'error',
    target: 'nuclear::plugin::spotify',
    source: { type: 'plugin', scope: 'spotify' },
    message: `Unhandled rejection in Spotify stream resolver
Error: ECONNRESET - Connection reset by peer
    at TLSWrap.onStreamRead (node:internal/stream_base_commons:217:20)
    at TLSWrap.callbackTrampoline (node:internal/async_hooks:130:17)
    at SpotifyClient.getStreamUrl (spotify-client.ts:89)
    at SpotifyPlugin.resolveStream (spotify.ts:142)
    at StreamResolver.resolve (stream-resolver.ts:87)
    at async PlaybackController.play (playback.ts:56)

Retry attempt 3 of 5...
Backoff delay: 4000ms
Previous attempts failed at: 14:23:01.123, 14:23:03.456`,
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 3000),
    level: 'warn',
    target: 'nuclear::streaming',
    source: { type: 'core', scope: 'streaming' },
    message: `Audio buffer underrun detected during playback
Current buffer: 0.8s (threshold: 2.0s)
Network conditions:
  Download speed: 245 KB/s (expected: 1200 KB/s)
  Latency: 340ms (expected: <100ms)
  Packet loss: 2.3%
  Connection type: WiFi (weak signal)

Switching to lower quality stream (128kbps -> 96kbps)
Prebuffering 5s before resuming playback...
Track: "Pink Floyd - Echoes (Live)" [23:31]
Position: 12:45 / 23:31`,
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 4000),
    level: 'info',
    target: 'nuclear::app',
    source: { type: 'core', scope: 'app' },
    message: `System diagnostics report:
  OS: macOS 15.3.1 (arm64)
  Memory: 1.2 GB / 16 GB used
  CPU: 4.2% average (8 cores)
  Disk: 45.6 GB free
  Uptime: 3h 22m 15s
  Plugins loaded: 4/5
  Tracks in queue: 23
  Audio output: Built-in Output (48000 Hz, 32-bit float)
  Active connections: 3
  Cache size: 234 MB (limit: 500 MB)`,
  },
];

export const clickableChipsLogs: LogEntryData[] = [
  {
    id: '1',
    timestamp: new Date(),
    level: 'error',
    target: 'nuclear::plugin::spotify',
    source: { type: 'plugin', scope: 'spotify' },
    message: 'Stream resolution failed: 403 Forbidden',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 500),
    level: 'warn',
    target: 'nuclear::http',
    source: { type: 'core', scope: 'http' },
    message: 'Request timeout after 30s — retrying with exponential backoff',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000),
    level: 'info',
    target: 'nuclear::plugin::youtube_music',
    source: { type: 'plugin', scope: 'youtube-music' },
    message: 'Track resolved: "Radiohead - Paranoid Android" (videoId: abc123)',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1500),
    level: 'debug',
    target: 'nuclear::playback',
    source: { type: 'core', scope: 'playback' },
    message: 'Crossfade started: 3.0s overlap between tracks',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 2000),
    level: 'error',
    target: 'nuclear::plugin::youtube_music',
    source: { type: 'plugin', scope: 'youtube-music' },
    message: 'Age-restricted content blocked: videoId xyz789',
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 2500),
    level: 'info',
    target: 'nuclear::app',
    source: { type: 'core', scope: 'app' },
    message: 'Equalizer preset applied: "Rock"',
  },
];

export const generateLogs = (count: number): LogEntryData[] => {
  const levels: LogEntryData['level'][] = [
    'error',
    'warn',
    'info',
    'debug',
    'trace',
  ];
  const sources: Array<{ scope: string; type: 'core' | 'plugin' }> = [
    { scope: 'app', type: 'core' },
    { scope: 'plugins', type: 'core' },
    { scope: 'http', type: 'core' },
    { scope: 'streaming', type: 'core' },
    { scope: 'playback', type: 'core' },
    { scope: 'youtube-music', type: 'plugin' },
    { scope: 'spotify', type: 'plugin' },
  ];
  const targets = [
    'nuclear::app',
    'nuclear::plugins',
    'nuclear::http',
    'nuclear::streaming',
    'nuclear::playback',
    'nuclear::plugin::youtube_music',
    'nuclear::plugin::spotify',
  ];
  const messages = [
    'Application started',
    'Plugin loaded successfully',
    'HTTP request to api.example.com/v1/search',
    'Stream resolution started',
    'Playback state changed to playing',
    'Rate limited, backing off for 5s',
    'Failed to authenticate: Invalid credentials',
    'Searching for: Artist - Track Title',
    'Buffer status: 45.2s remaining',
    'Theme changed to dark mode',
    'Settings saved to disk',
    'Queue updated: 12 tracks',
  ];

  const now = Date.now();
  return Array.from({ length: count }).map((_, index) => {
    const level = levels[index % levels.length];
    const source = sources[index % sources.length];
    const target = targets[index % targets.length];
    const message = messages[index % messages.length];

    return {
      id: `log-${index}`,
      timestamp: new Date(now - index * 1000),
      level,
      target,
      source,
      message,
    };
  });
};
