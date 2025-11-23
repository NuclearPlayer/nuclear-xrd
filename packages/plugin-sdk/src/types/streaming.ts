import type { StreamCandidate, Track } from '@nuclearplayer/model';

export type { StreamCandidate };

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
