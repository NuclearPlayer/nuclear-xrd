import {
  generateAdvancedThemeCSS,
  generateAdvancedThemeCSSFromJSON,
} from './advanced/generator';
import {
  AdvancedTheme,
  AdvancedThemeSchema,
  parseAdvancedTheme,
} from './advanced/schema';
import { BUILTIN_BASIC_THEME_IDS } from './basic';

import './basic/aurora.css';
import './basic/ember.css';
import './basic/lagoon.css';
import './basic/canyon.css';

export type BasicThemeMeta = {
  id: string;
  name: string;
  palette: [string, string, string, string];
};

const BUILT_INS: BasicThemeMeta[] = [
  {
    id: 'nuclear:aurora',
    name: 'Aurora',
    palette: [
      'oklch(0.74 0.15 305)',
      'oklch(0.98 0.01 340)',
      'oklch(0.74 0.15 305)',
      'oklch(0.42 0.04 278)',
    ],
  },
  {
    id: 'nuclear:ember',
    name: 'Ember',
    palette: [
      'oklch(0.76 0.14 30)',
      'oklch(0.97 0.02 70)',
      'oklch(0.76 0.14 30)',
      'oklch(0.4 0.03 277)',
    ],
  },
  {
    id: 'nuclear:lagoon',
    name: 'Lagoon',
    palette: [
      'oklch(0.67 0.16 205)',
      'oklch(0.985 0.018 210)',
      'oklch(0.67 0.16 205)',
      'oklch(0.33 0.035 245)',
    ],
  },
  {
    id: 'nuclear:canyon',
    name: 'Canyon',
    palette: [
      'oklch(0.68 0.19 38)',
      'oklch(0.975 0.02 70)',
      'oklch(0.68 0.19 38)',
      'oklch(0.36 0.03 30)',
    ],
  },
];

export function listBasicThemes(): BasicThemeMeta[] {
  const allowed = new Set<string>(BUILTIN_BASIC_THEME_IDS as readonly string[]);
  return BUILT_INS.filter((t) => allowed.has(t.id));
}

export function setThemeId(id: string): void {
  const root = document.documentElement;
  root.setAttribute('data-theme-id', id);
}

export function setBasicTheme(id: string): void {
  setThemeId(id);
}

const ADV_STYLE_ID = 'advanced-theme';

export function applyAdvancedTheme(theme: AdvancedTheme): void {
  const parsed = AdvancedThemeSchema.parse(theme);
  const css = generateAdvancedThemeCSS(parsed);
  let style = document.getElementById(ADV_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = ADV_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

export function clearAdvancedTheme(): void {
  const style = document.getElementById(ADV_STYLE_ID);
  if (style?.parentNode) style.parentNode.removeChild(style);
}

export type { AdvancedTheme };
export { BUILTIN_BASIC_THEME_IDS };
export { parseAdvancedTheme, generateAdvancedThemeCSSFromJSON };
