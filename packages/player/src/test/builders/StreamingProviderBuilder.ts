import type { Stream, StreamCandidate } from '@nuclearplayer/model';
import type { StreamingProvider } from '@nuclearplayer/plugin-sdk';

export class StreamingProviderBuilder {
  private provider: StreamingProvider;

  constructor() {
    this.provider = {
      id: 'test-streaming-provider',
      kind: 'streaming',
      name: 'Test Streaming Provider',
      searchForTrack: async () => [],
      getStreamUrl: async () => ({
        url: 'https://example.com/stream.mp3',
        protocol: 'https',
        source: { provider: 'test-streaming-provider', id: 'stream-1' },
      }),
    };
  }

  withId(id: string): this {
    this.provider.id = id;
    return this;
  }

  withName(name: string): this {
    this.provider.name = name;
    return this;
  }

  withSearchForTrack(
    searchForTrack: StreamingProvider['searchForTrack'],
  ): this {
    this.provider.searchForTrack = searchForTrack;
    return this;
  }

  withGetStreamUrl(getStreamUrl: StreamingProvider['getStreamUrl']): this {
    this.provider.getStreamUrl = getStreamUrl;
    return this;
  }

  withSupportsLocalFiles(supportsLocalFiles: boolean): this {
    this.provider.supportsLocalFiles = supportsLocalFiles;
    return this;
  }

  build(): StreamingProvider {
    return this.provider;
  }
}

export const createMockCandidate = (
  id: string,
  title: string,
  options: Partial<StreamCandidate> = {},
): StreamCandidate => ({
  id,
  title,
  source: { provider: 'test-streaming-provider', id },
  failed: false,
  ...options,
});

export const createMockStream = (
  candidateId: string,
  options: Partial<Stream> = {},
): Stream => ({
  url: `https://example.com/${candidateId}.mp3`,
  protocol: 'https',
  source: { provider: 'test-streaming-provider', id: candidateId },
  ...options,
});
