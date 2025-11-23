import type { Track } from '@nuclearplayer/model';

import type {
  StreamingHost,
  StreamResolutionListener,
} from '../types/streaming';

export class StreamingAPI {
  #host?: StreamingHost;

  constructor(host?: StreamingHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: StreamingHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Streaming host not available');
    }
    return fn(host);
  }

  resolveCandidatesForTrack(track: Track) {
    return this.#withHost((h) => h.resolveCandidatesForTrack(track));
  }

  resolveStreamForCandidate(track: Track, candidateId: string) {
    return this.#withHost((h) =>
      h.resolveStreamForCandidate(track, candidateId),
    );
  }

  subscribe(listener: StreamResolutionListener) {
    return this.#withHost((h) => h.subscribe(listener));
  }
}
