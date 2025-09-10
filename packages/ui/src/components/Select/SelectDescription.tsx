import { FC } from 'react';

import { useSelectContext } from './context';

export const SelectDescription: FC<{ description?: string }> = ({
  description,
}) => {
  const {
    ids: { descriptionId },
  } = useSelectContext();
  if (!description) {
    return null;
  }
  return (
    <p
      id={descriptionId}
      className="text-foreground-secondary text-sm select-none"
    >
      {description}
    </p>
  );
};
