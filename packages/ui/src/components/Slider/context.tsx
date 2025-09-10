import type { KeyboardEvent } from 'react';
import { createContext, useContext } from 'react';

export type SliderContextValue = {
  inputId: string;
  labelId: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  disabled?: boolean;
  percentage: number;
  emit: (v: number) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  labelText?: string;
};

const SliderContext = createContext<SliderContextValue | null>(null);

export const useSliderContext = () => {
  const ctx = useContext(SliderContext);
  if (!ctx) {
    throw new Error('Slider.* must be used within <Slider>');
  }
  return ctx;
};

export const SliderProvider = SliderContext.Provider;
