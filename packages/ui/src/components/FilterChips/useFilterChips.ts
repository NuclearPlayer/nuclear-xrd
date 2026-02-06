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
  if (config.multiple) {
    return {
      isSelected: (id: string) => config.selected.includes(id),
      handleClick: (id: string) => {
        if (config.selected.includes(id)) {
          config.onChange(config.selected.filter((s) => s !== id));
        } else {
          config.onChange([...config.selected, id]);
        }
      },
    };
  }

  return {
    isSelected: (id: string) => config.selected === id,
    handleClick: (id: string) => config.onChange(id),
  };
};
