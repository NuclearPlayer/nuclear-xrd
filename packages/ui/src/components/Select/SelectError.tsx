import { FC } from 'react';

import { useSelectContext } from './context';

export const SelectError: FC<{ error?: string }> = ({ error }) => {
  const {
    ids: { errorId },
  } = useSelectContext();
  if (!error) return null;
  return (
    <p id={errorId} className="text-accent-red text-xs select-none">
      {error}
    </p>
  );
};
