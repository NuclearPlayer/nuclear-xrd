import type { DragEndEvent } from '@dnd-kit/core';

export type UseReorderParams = {
  itemIds: string[];
  onReorder?: (fromIndex: number, toIndex: number) => void;
};

export function useReorder({ itemIds, onReorder }: UseReorderParams) {
  const onDragStart = () => {};

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) {
      return;
    }

    const fromIndex = itemIds.indexOf(active.id as string);
    const toIndex = itemIds.indexOf(over.id as string);

    onReorder(fromIndex, toIndex);
  };

  return { onDragStart, onDragEnd } as const;
}
