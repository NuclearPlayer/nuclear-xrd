export const BUILTIN_BASIC_THEME_IDS = [
  'nuclear:aurora',
  'nuclear:ember',
  'nuclear:lagoon',
  'nuclear:canyon',
] as const;

export type BuiltinBasicThemeId = (typeof BUILTIN_BASIC_THEME_IDS)[number];
