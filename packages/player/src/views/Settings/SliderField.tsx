import { FC } from 'react';

import { Slider } from '@nuclearplayer/ui';

type Props = {
  label: string;
  description?: string;
  value: number | undefined;
  setValue: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

export const SliderField: FC<Props> = ({
  label,
  value,
  setValue,
  min,
  max,
  step,
  unit,
}) => (
  <Slider
    label={label}
    showFooter
    unit={unit}
    min={min}
    max={max}
    step={step}
    value={Number(value ?? 0)}
    onValueChange={setValue}
  />
);
