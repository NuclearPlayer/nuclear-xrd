import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export function ReorderLayer({
  enabled,
  items,
  onDragStart,
  onDragEnd,
  children,
}: {
  enabled: boolean;
  items: string[];
  onDragStart?: () => void;
  onDragEnd?: (evt: DragEndEvent) => void;
  children: React.ReactNode;
}) {
  if (!enabled) {
    return <>{children}</>;
  }
  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
