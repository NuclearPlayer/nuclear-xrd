import { FC } from 'react';

import { Input } from '@nuclearplayer/ui';

type Props = {
  label: string;
  description?: string;
  value: string | undefined;
  setValue: (v: string) => void;
  variant?: 'text' | 'password';
};

export const TextField: FC<Props> = ({
  label,
  description,
  value,
  setValue,
  variant = 'text',
}) => (
  <Input
    variant={variant}
    label={label}
    description={description}
    value={value ?? ''}
    onChange={(e) => setValue(e.target.value)}
  />
);
