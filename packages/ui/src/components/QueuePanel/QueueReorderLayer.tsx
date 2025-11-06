import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FC, ReactNode } from 'react';

type QueueReorderLayerProps = {
  enabled: boolean;
  items: string[];
  onDragStart?: () => void;
  onDragEnd?: (evt: DragEndEvent) => void;
  children: ReactNode;
};

export const QueueReorderLayer: FC<QueueReorderLayerProps> = ({
  enabled,
  items,
  onDragStart,
  onDragEnd,
  children,
}) => {
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
};
