import type { DragEndEvent } from '@dnd-kit/core';

import type { Track } from '@nuclearplayer/model';

export type UseReorderParams<T extends Track> = {
  tracks: T[];
  onReorder?: (ids: string[]) => void;
};

export function useReorder<T extends Track>({
  tracks,
  onReorder,
}: UseReorderParams<T>) {
  const onDragStart = () => {
    // TODO: use this for a drag overlay
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    if (!onReorder) {
      return;
    }

    const oldIndex = tracks.findIndex((t) => t.source.id === active.id);
    const newIndex = tracks.findIndex((t) => t.source.id === over.id);
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const next = [...tracks];
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);

    onReorder(next.map((t) => t.source.id));
  };

  return { onDragStart, onDragEnd } as const;
}
