export type ThemeTier = 'basic' | 'advanced';

export type ThemeVarName =
  | 'background'
  | 'background-secondary'
  | 'background-input'
  | 'foreground'
  | 'foreground-secondary'
  | 'foreground-input'
  | 'primary'
  | 'border'
  | 'ring'
  | 'accent-green'
  | 'accent-yellow'
  | 'accent-purple'
  | 'accent-blue'
  | 'accent-orange'
  | 'accent-cyan'
  | 'accent-red'
  | 'shadow-color'
  | 'shadow-x'
  | 'shadow-y'
  | 'shadow-blur'
  | 'radius'
  | 'radius-sm'
  | 'radius-lg'
  | 'font-family';

export type ThemeVariables = Partial<Record<ThemeVarName, string>>;

export type ResolvedTheme = {
  light: ThemeVariables;
  dark: ThemeVariables;
};

export type ThemeFileV1 = {
  version: 1;
  name: string;
  variables?: ThemeVariables;
  dark?: ThemeVariables;
};
