import type { ResolvedTheme } from './types';
import { cssVarBlock } from './utils/css';

const LIGHT_STYLE_ID = 'theme-light-variables';
const DARK_STYLE_ID = 'theme-dark-overrides';

export const applyTheme = (theme: ResolvedTheme) => {
  upsertLightStyle(theme.light as Record<string, string>);
  upsertDarkStyle(theme.dark as Record<string, string>);
};

const upsertLightStyle = (vars: Record<string, string>) => {
  const style =
    (document.getElementById(LIGHT_STYLE_ID) as HTMLStyleElement | null) ??
    document.head.appendChild(
      Object.assign(document.createElement('style'), { id: LIGHT_STYLE_ID }),
    );
  style.textContent = cssVarBlock(':root', vars);
};

const upsertDarkStyle = (vars: Record<string, string>) => {
  const style =
    (document.getElementById(DARK_STYLE_ID) as HTMLStyleElement | null) ??
    document.head.appendChild(
      Object.assign(document.createElement('style'), { id: DARK_STYLE_ID }),
    );
  style.textContent = cssVarBlock("[data-theme='dark']", vars);
};
