import { describe, expect, it } from 'vitest';

import { applyTheme } from '../apply';
import { parseThemeJson } from '../parse';
import { defaultTheme } from '../presets/defaultTheme';
import { resolveAdvanced, resolveBasic, resolveDefaults } from '../resolve';
import type { ResolvedTheme, ThemeFileV1 } from '../types';
import { parseOklch } from '../utils/color';

describe('Themes utilities', () => {
  it('resolveDefaults returns the canonical default theme', () => {
    const resolved = resolveDefaults();
    expect(resolved).toEqual(defaultTheme);
  });

  it('resolveBasic keeps L/C from defaults and swaps hue based on primary', () => {
    const primary = 'oklch(0.6 0.2 120)';
    const resolved = resolveBasic(primary);

    expect(resolved.light.primary).toBe(primary);

    const baseLight = parseOklch(defaultTheme.light.background!);
    const baseDark = parseOklch(defaultTheme.dark.background!);
    const outLight = parseOklch(resolved.light.background!);
    const outDark = parseOklch(resolved.dark.background!);

    expect(outLight!.l).toBeCloseTo(baseLight!.l, 6);
    expect(outLight!.c).toBeCloseTo(baseLight!.c, 6);
    expect(outLight!.h).toBeCloseTo(120, 6);

    expect(outDark!.l).toBeCloseTo(baseDark!.l, 6);
    expect(outDark!.c).toBeCloseTo(baseDark!.c, 6);
    expect(outDark!.h).toBeCloseTo(120, 6);
  });

  it('resolveAdvanced overlays variables and dark-specific values over defaults', () => {
    const file: ThemeFileV1 = {
      version: 1,
      name: 'Test',
      variables: {
        primary: 'oklch(0.7 0.18 200)',
        radius: '10px',
      },
      dark: {
        background: 'oklch(0.45 0.08 200)',
      },
    };

    const resolved = resolveAdvanced(file);

    expect(resolved.light.primary).toBe(file.variables!.primary);
    expect(resolved.light.radius).toBe('10px');

    expect(resolved.dark.background).toBe(file.dark!.background);
    expect(resolved.light.border).toBe(defaultTheme.light.border);
  });

  it('applyTheme writes CSS variables in a light block and a dark override block', () => {
    const theme: ResolvedTheme = {
      light: {
        background: 'oklch(0.9 0.02 40)',
        primary: 'oklch(0.7 0.15 40)',
      },
      dark: {
        background: 'oklch(0.4 0.08 40)',
      },
    };

    applyTheme(theme);

    const lightStyle = document.getElementById(
      'theme-light-variables',
    ) as HTMLStyleElement | null;
    expect(lightStyle).not.toBeNull();
    expect(lightStyle!.textContent).toContain(
      '--background: ' + theme.light.background + ';',
    );

    const darkStyle = document.getElementById(
      'theme-dark-overrides',
    ) as HTMLStyleElement | null;
    expect(darkStyle).not.toBeNull();
    expect(darkStyle!.textContent).toContain(
      '--background: ' + theme.dark.background + ';',
    );
    expect(darkStyle!.textContent).toContain("[data-theme='dark']");
  });

  it('parseThemeJson validates and returns a ThemeFileV1', () => {
    const json = JSON.stringify({
      version: 1,
      name: 'Parsed',
      variables: { primary: 'oklch(0.6 0.2 100)' },
      dark: { background: 'oklch(0.4 0.08 100)' },
    });

    const parsed = parseThemeJson(json);
    expect(parsed.version).toBe(1);
    expect(parsed.name).toBe('Parsed');
    expect(parsed.variables!.primary).toBe('oklch(0.6 0.2 100)');
    expect(parsed.dark!.background).toBe('oklch(0.4 0.08 100)');
  });
});
