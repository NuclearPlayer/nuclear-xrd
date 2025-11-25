import type { StreamCandidate, Track } from '@nuclearplayer/model';
import type {
  StreamingHost,
  StreamingProvider,
} from '@nuclearplayer/plugin-sdk';

import { useSettingsStore } from '../stores/settingsStore';
import { providersHost } from './providersHost';

const getActiveStreamingProvider = (): StreamingProvider | undefined => {
  const providers = providersHost.list<'streaming'>('streaming');
  return providers[0] as StreamingProvider | undefined;
};

const isStreamExpired = (candidate: StreamCandidate): boolean => {
  if (!candidate.lastResolvedAtIso || !candidate.stream) {
    return true;
  }

  const expiryMs = useSettingsStore
    .getState()
    .getValue('playback.streamExpiryMs') as number;
  const resolvedAt = new Date(candidate.lastResolvedAtIso).getTime();

  return Date.now() - resolvedAt > expiryMs;
};

const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const createStreamingHost = (): StreamingHost => ({
  resolveCandidatesForTrack: async (track: Track) => {
    const provider = getActiveStreamingProvider();

    if (!provider) {
      return {
        success: false,
        error: 'No streaming provider available',
      };
    }

    try {
      const artistName = track.artists[0]?.name ?? 'Unknown Artist';
      const albumName = track.album?.title;

      const candidates = await provider.searchForTrack(
        artistName,
        track.title,
        albumName,
      );

      return {
        success: true,
        candidates,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to resolve candidates: ${message}`,
      };
    }
  },

  resolveStreamForCandidate: async (candidate: StreamCandidate) => {
    const provider = getActiveStreamingProvider();

    if (!provider) {
      return undefined;
    }

    if (candidate.failed) {
      return candidate;
    }

    if (candidate.stream && !isStreamExpired(candidate)) {
      return candidate;
    }

    const retries = useSettingsStore
      .getState()
      .getValue('playback.streamResolutionRetries') as number;

    try {
      const stream = await withRetry(
        () => provider.getStreamUrl(candidate.id),
        retries,
      );

      return {
        ...candidate,
        stream,
        lastResolvedAtIso: new Date().toISOString(),
        failed: false,
      };
    } catch {
      return {
        ...candidate,
        failed: true,
        stream: undefined,
      };
    }
  },
});

export const streamingHost = createStreamingHost();
