import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';
import { useRef } from 'react';

export type UseVirtualRowsArgs = {
  count: number;
  rowHeight: number;
  overscan: number;
  scrollParentRef?: React.RefObject<HTMLDivElement | null>;
};

export type UseVirtualRowsResult = {
  scrollParentRef: React.RefObject<HTMLDivElement | null>;
  virtualItems: VirtualItem[];
  paddingTop: number;
  paddingBottom: number;
  totalSize: number;
};

export function useVirtualRows({
  count,
  rowHeight,
  overscan,
  scrollParentRef: maybeRef,
}: UseVirtualRowsArgs): UseVirtualRowsResult {
  const internalRef = useRef<HTMLDivElement | null>(null);
  const scrollParentRef = maybeRef ?? internalRef;

  const virtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count,
    estimateSize: () => rowHeight,
    getScrollElement: () => scrollParentRef.current,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
      : 0;

  return {
    scrollParentRef,
    virtualItems,
    paddingTop,
    paddingBottom,
    totalSize: virtualizer.getTotalSize(),
  };
}
