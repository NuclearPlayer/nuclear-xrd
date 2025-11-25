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
  candidates?: StreamCandidate[];
  error?: string;
};

export type StreamingHost = {
  resolveCandidatesForTrack: (track: Track) => Promise<StreamResolutionResult>;
  resolveStreamForCandidate: (
    candidate: StreamCandidate,
  ) => Promise<StreamCandidate | undefined>;
};
