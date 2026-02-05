import { useCallback } from 'react';

type SingleSelectConfig = {
  multiple?: false;
  selected: string;
  onChange: (id: string) => void;
};

type MultiSelectConfig = {
  multiple: true;
  selected: string[];
  onChange: (ids: string[]) => void;
};

export type UseFilterChipsConfig = SingleSelectConfig | MultiSelectConfig;

export const useFilterChips = (config: UseFilterChipsConfig) => {
  const { multiple, selected, onChange } = config;

  const isSelected = useCallback(
    (id: string): boolean => {
      if (multiple) {
        return (selected as string[]).includes(id);
      }
      return selected === id;
    },
    [multiple, selected],
  );

  const handleClick = useCallback(
    (id: string) => {
      if (multiple) {
        const selectedArr = selected as string[];
        const onChangeMulti = onChange as (ids: string[]) => void;
        if (selectedArr.includes(id)) {
          onChangeMulti(selectedArr.filter((s) => s !== id));
        } else {
          onChangeMulti([...selectedArr, id]);
        }
      } else {
        (onChange as (id: string) => void)(id);
      }
    },
    [multiple, selected, onChange],
  );

  return { isSelected, handleClick };
};
