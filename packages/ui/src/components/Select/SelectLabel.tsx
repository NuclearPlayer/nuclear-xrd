import { FC } from 'react';

import { useSelectContext } from './context';

export const SelectLabel: FC<{ label?: string }> = ({ label }) => {
  const {
    ids: { labelId, selectId },
  } = useSelectContext();
  if (!label) {
    return null;
  }
  return (
    <label
      htmlFor={selectId}
      id={labelId}
      className="text-foreground text-sm font-semibold"
    >
      {label}
    </label>
  );
};
