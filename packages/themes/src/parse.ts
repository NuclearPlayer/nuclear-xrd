import { ThemeFileSchemaV1 } from './schema';
import type { ThemeFileV1 } from './types';

export const parseThemeJson = (text: string): ThemeFileV1 => {
  const data = JSON.parse(text);
  const parsed = ThemeFileSchemaV1.parse(data);
  return parsed;
};
