import { defaultTheme } from './presets/defaultTheme';
import type { ResolvedTheme, ThemeFileV1, ThemeVariables } from './types';
import { buildOklch, parseOklch } from './utils/color';

export const resolveDefaults = (): ResolvedTheme => defaultTheme;

export const resolveBasic = (primary: string): ResolvedTheme => {
  const referenceLightBackground = defaultTheme.light.background ?? '';
  const referenceDarkBackground = defaultTheme.dark.background ?? '';

  const primaryComponents = parseOklch(primary);
  const lightComponents = parseOklch(referenceLightBackground);
  const darkComponents = parseOklch(referenceDarkBackground);
  const hue = primaryComponents?.h ?? lightComponents?.h ?? 0;

  const light: ThemeVariables = {
    primary,
    background: buildOklch({
      l: lightComponents!.l,
      c: lightComponents!.c,
      h: hue,
    }),
  };

  const dark: ThemeVariables = {
    background: buildOklch({
      l: darkComponents!.l,
      c: darkComponents!.c,
      h: hue,
    }),
  };

  return mergeResolved(defaultTheme, { light, dark });
};

export const resolveAdvanced = (file: ThemeFileV1): ResolvedTheme => {
  const light = { ...defaultTheme.light, ...(file.variables ?? {}) };
  const dark = { ...defaultTheme.dark, ...(file.dark ?? {}) };
  return { light, dark };
};

export const mergeResolved = (
  base: ResolvedTheme,
  overlay: Partial<ResolvedTheme>,
): ResolvedTheme => ({
  light: { ...base.light, ...(overlay.light ?? {}) },
  dark: { ...base.dark, ...(overlay.dark ?? {}) },
});
