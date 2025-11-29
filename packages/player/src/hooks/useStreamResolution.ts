import { useEffect, useRef } from 'react';

import type { QueueItem, StreamCandidate, Track } from '@nuclearplayer/model';

import { streamingHost } from '../services/streamingHost';
import { useQueueStore } from '../stores/queue/queue.store';
import { useSoundStore } from '../stores/soundStore';

const getFirstNonFailedCandidate = (
  candidates: StreamCandidate[],
): StreamCandidate | undefined => {
  return candidates.find((candidate) => !candidate.failed);
};

const buildAudioSource = (
  candidate: StreamCandidate,
): string | { src: string; type?: string }[] => {
  const stream = candidate.stream;
  if (!stream) {
    return candidate.id;
  }

  if (stream.mimeType) {
    return [{ src: stream.url, type: stream.mimeType }];
  }

  return stream.url;
};

export const useStreamResolution = (): void => {
  const currentItemIdRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = useQueueStore.subscribe((state) => {
      const currentItem = state.getCurrentItem();
      if (!currentItem || currentItem.id === currentItemIdRef.current) {
        return;
      }

      currentItemIdRef.current = currentItem.id;
      void resolveAndPlay(currentItem);
    });

    const initialItem = useQueueStore.getState().getCurrentItem();
    if (initialItem) {
      currentItemIdRef.current = initialItem.id;
      void resolveAndPlay(initialItem);
    }

    return unsubscribe;
  }, []);
};

const resolveAndPlay = async (item: QueueItem): Promise<void> => {
  const { updateItemState } = useQueueStore.getState();
  const { setSrc, play } = useSoundStore.getState();
  const { track } = item;

  updateItemState(item.id, { status: 'loading', error: undefined });

  const candidates = await resolveCandidates(track);
  if (!candidates) {
    updateItemState(item.id, {
      status: 'error',
      error: 'Failed to find stream candidates',
    });
    return;
  }

  updateItemState(item.id, {
    track: { ...track, streamCandidates: candidates },
  });

  const resolvedCandidate = await resolveStreamWithFallback(
    candidates,
    item.id,
  );
  if (!resolvedCandidate?.stream) {
    updateItemState(item.id, {
      status: 'error',
      error: 'All stream candidates failed',
    });
    return;
  }

  updateItemState(item.id, { status: 'success' });

  const audioSource = buildAudioSource(resolvedCandidate);
  setSrc(audioSource);
  play();
};

const resolveCandidates = async (
  track: Track,
): Promise<StreamCandidate[] | undefined> => {
  if (track.streamCandidates && track.streamCandidates.length > 0) {
    return track.streamCandidates;
  }

  const result = await streamingHost.resolveCandidatesForTrack(track);
  if (!result.success || !result.candidates) {
    return undefined;
  }

  return result.candidates;
};

const resolveStreamWithFallback = async (
  candidates: StreamCandidate[],
  itemId: string,
): Promise<StreamCandidate | undefined> => {
  const { updateItemState } = useQueueStore.getState();
  let workingCandidates = [...candidates];

  while (true) {
    const candidate = getFirstNonFailedCandidate(workingCandidates);
    if (!candidate) {
      return undefined;
    }

    const resolved = await streamingHost.resolveStreamForCandidate(candidate);
    if (!resolved) {
      return undefined;
    }

    workingCandidates = workingCandidates.map((candidate) =>
      candidate.id === resolved.id ? resolved : candidate,
    );

    const currentTrack = useQueueStore
      .getState()
      .items.find((item) => item.id === itemId)?.track;

    if (currentTrack) {
      updateItemState(itemId, {
        track: {
          ...currentTrack,
          streamCandidates: workingCandidates,
        },
      });
    }

    if (resolved.stream && !resolved.failed) {
      return resolved;
    }
  }
};
