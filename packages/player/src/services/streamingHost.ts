import type { StreamCandidate, Track } from '@nuclearplayer/model';
import type {
  StreamingHost,
  StreamingProvider,
  StreamResolutionListener,
} from '@nuclearplayer/plugin-sdk';

import { providersHost } from './providersHost';

export const createStreamingHost = (): StreamingHost => {
  const listeners = new Set<StreamResolutionListener>();

  const notifyListeners = (trackId: string, candidates: StreamCandidate[]) => {
    listeners.forEach((listener) => listener(trackId, candidates));
  };

  const getActiveStreamingProvider = (): StreamingProvider | undefined => {
    const providers = providersHost.list<'streaming'>('streaming');
    return providers[0] as StreamingProvider | undefined;
  };

  return {
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

        if (track.source.id) {
          notifyListeners(track.source.id, candidates);
        }

        return {
          success: true,
          candidatesFound: candidates.length,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: `Failed to resolve candidates: ${errorMessage}`,
        };
      }
    },

    resolveStreamForCandidate: async () => {
      return false;
    },

    subscribe: (listener: StreamResolutionListener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export const streamingHost = createStreamingHost();
