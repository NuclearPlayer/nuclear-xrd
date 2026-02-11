import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
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
  // Require 5px of movement before activating a drag. Without this,
  // dnd-kit's PointerSensor fires on any click, installs a document-level
  // capture listener that swallows the subsequent click event, and breaks
  // every interactive element inside sortable rows (buttons, dropdowns, etc.).
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  if (!enabled) {
    return <>{children}</>;
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
