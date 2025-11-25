import type { StreamCandidate, Track } from '@nuclearplayer/model';

import type { StreamingHost } from '../types/streaming';

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

  resolveStreamForCandidate(candidate: StreamCandidate) {
    return this.#withHost((h) => h.resolveStreamForCandidate(candidate));
  }
}
