import type {
  StreamingHost,
  StreamResolutionListener,
} from '@nuclearplayer/plugin-sdk';

export const createStreamingHost = (): StreamingHost => {
  const listeners = new Set<StreamResolutionListener>();

  return {
    resolveCandidatesForTrack: async () => {
      return {
        success: false,
        error: 'Not implemented yet',
      };
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
