import { converter, formatCss, oklch } from 'culori';

const asOklch = converter('oklch');

export type OklchComponents = { l: number; c: number; h: number };

export const parseOklch = (input: string): OklchComponents | null => {
  const { l, c, h } = oklch(input)!;
  return { l: l as number, c: c as number, h: h as number };
};

export const buildOklch = (components: OklchComponents): string =>
  formatCss({ mode: 'oklch', ...components });

export const replaceHue = (value: string, hue: number): string => {
  const { l, c } = asOklch(value)!;
  return formatCss({ mode: 'oklch', l, c, h: hue });
};
