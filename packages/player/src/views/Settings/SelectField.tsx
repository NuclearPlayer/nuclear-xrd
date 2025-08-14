import { FC } from 'react';

import { Select } from '@nuclearplayer/ui';

type Option = { id: string; label: string };

type Props = {
  label: string;
  description?: string;
  value: string | undefined;
  setValue: (v: string) => void;
  options: Option[];
};

export const SelectField: FC<Props> = ({
  label,
  description,
  value,
  setValue,
  options,
}) => (
  <Select
    label={label}
    description={description}
    options={options}
    value={value ?? ''}
    onValueChange={setValue}
  />
);
