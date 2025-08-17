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

export type BasicThemeMeta = {
  id: string;
  name: string;
};

const BUILT_INS: BasicThemeMeta[] = [
  { id: 'nuclear:aurora', name: 'Aurora' },
  { id: 'nuclear:ember', name: 'Ember' },
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
