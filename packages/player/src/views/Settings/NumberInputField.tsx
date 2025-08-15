import { FC } from 'react';

import { Input } from '@nuclearplayer/ui';

type Props = {
  label: string;
  description?: string;
  value: number | string | undefined;
  setValue: (v: number) => void;
};

export const NumberInputField: FC<Props> = ({
  label,
  description,
  value,
  setValue,
}) => (
  <Input
    variant="number"
    label={label}
    description={description}
    value={String(value ?? '')}
    onChange={(e) => setValue(Number(e.target.value))}
  />
);
