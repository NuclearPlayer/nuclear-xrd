import type { Stream, StreamCandidate, Track } from '@nuclearplayer/model';

import type { ProviderDescriptor } from './providers';

export type { StreamCandidate };

export type StreamingProvider = ProviderDescriptor<'streaming'> & {
  searchForTrack: (
    artist: string,
    title: string,
    album?: string,
  ) => Promise<StreamCandidate[]>;

  getStreamUrl: (candidateId: string) => Promise<Stream>;

  supportsLocalFiles?: boolean;
};

export type StreamResolutionResult = {
  success: boolean;
  candidatesFound?: number;
  error?: string;
};

export type StreamResolutionListener = (
  trackId: string,
  candidates: StreamCandidate[],
) => void;

export type StreamingHost = {
  resolveCandidatesForTrack: (track: Track) => Promise<StreamResolutionResult>;
  resolveStreamForCandidate: (
    track: Track,
    candidateId: string,
  ) => Promise<boolean>;
  subscribe: (listener: StreamResolutionListener) => () => void;
};
