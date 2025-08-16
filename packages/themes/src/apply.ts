import type { ResolvedTheme } from './types';
import { cssVarBlock } from './utils/css';

const DARK_STYLE_ID = 'theme-dark-overrides';
export const applyTheme = (theme: ResolvedTheme) => {
  const root = document.documentElement;
  const setVars = (vars: Record<string, string>) => {
    Object.entries(vars).forEach(([k, v]) =>
      root.style.setProperty(`--${k}`, v),
    );
  };

  setVars(theme.light as Record<string, string>);
  upsertDarkStyle(theme.dark as Record<string, string>);
};

const upsertDarkStyle = (vars: Record<string, string>) => {
  const style =
    (document.getElementById(DARK_STYLE_ID) as HTMLStyleElement | null) ??
    document.head.appendChild(
      Object.assign(document.createElement('style'), { id: DARK_STYLE_ID }),
    );

  style.textContent = cssVarBlock("[data-theme='dark']", vars);
};
