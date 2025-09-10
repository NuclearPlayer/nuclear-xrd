import { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export function useSorting() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const isSorted = useMemo(() => sorting.length > 0, [sorting]);

  return { sorting, setSorting, isSorted } as const;
}
