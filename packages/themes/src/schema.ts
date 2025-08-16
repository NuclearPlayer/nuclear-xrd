import { z } from 'zod';

import type { ThemeFileV1, ThemeVarName } from './types';

export const themeVarKeys: ThemeVarName[] = [
  'background',
  'background-secondary',
  'background-input',
  'foreground',
  'foreground-secondary',
  'foreground-input',
  'primary',
  'border',
  'ring',
  'accent-green',
  'accent-yellow',
  'accent-purple',
  'accent-blue',
  'accent-orange',
  'accent-cyan',
  'accent-red',
  'shadow-color',
  'shadow-x',
  'shadow-y',
  'shadow-blur',
  'radius',
  'radius-sm',
  'radius-lg',
  'font-family',
];

const varsRecord = z.record(
  z.enum(themeVarKeys as unknown as [ThemeVarName, ...ThemeVarName[]]),
  z.string(),
);

export const ThemeFileSchemaV1 = z.object({
  version: z.literal(1),
  name: z.string().min(1),
  variables: varsRecord.optional(),
  dark: varsRecord.optional(),
});

export type ThemeFileParsed = z.infer<typeof ThemeFileSchemaV1> & ThemeFileV1;
