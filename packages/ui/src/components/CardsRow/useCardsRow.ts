import isEmpty from 'lodash-es/isEmpty';
import { RefObject, useMemo, useRef, useState } from 'react';

import { CardsRowItem } from './CardsRow';

const SCROLL_INCREMENT = 176;

type UseCardsRowResult = {
  filterText: string;
  setFilterText: (text: string) => void;
  clearFilter: () => void;
  filteredItems: CardsRowItem[];
  scrollContainerRef: RefObject<HTMLDivElement>;
  scrollLeft: () => void;
  scrollRight: () => void;
};

export function useCardsRow(items: CardsRowItem[]): UseCardsRowResult {
  const [filterText, setFilterText] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    if (isEmpty(filterText.trim())) {
      return items;
    }
    const lowerFilter = filterText.toLowerCase();
    return items.filter((item) =>
      item.title.toLowerCase().includes(lowerFilter),
    );
  }, [items, filterText]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -SCROLL_INCREMENT,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: SCROLL_INCREMENT,
      behavior: 'smooth',
    });
  };

  const clearFilter = () => {
    setFilterText('');
  };

  return {
    filterText,
    setFilterText,
    clearFilter,
    filteredItems,
    scrollContainerRef,
    scrollLeft,
    scrollRight,
  };
}
