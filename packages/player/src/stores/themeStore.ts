import { readTextFile } from '@tauri-apps/plugin-fs';
import { create } from 'zustand';

import {
  applyTheme,
  parseThemeJson,
  resolveAdvanced,
  resolveBasic,
  resolveDefaults,
  type ResolvedTheme,
} from '@nuclearplayer/themes';

import { coreSettingsHost } from './settingsStore';

export type ThemeTier = 'basic' | 'advanced';

type ThemeState = {
  resolved?: ResolvedTheme;
  applyFromSettings: () => Promise<void>;
  setTier: (tier: ThemeTier) => Promise<void>;
  setPrimary: (primary: string) => Promise<void>;
  setActiveThemePath: (path: string | undefined) => Promise<void>;
};

const resolveFromSettings = async (): Promise<ResolvedTheme> => {
  const tier = ((await coreSettingsHost.get<string>('theme.tier')) ??
    'basic') as ThemeTier;
  const primary =
    (await coreSettingsHost.get<string>('theme.primary')) ??
    resolveDefaults().light.primary ??
    '';
  const activeThemePath = await coreSettingsHost.get<string | undefined>(
    'theme.activeThemePath',
  );
  if (tier === 'basic') return resolveBasic(primary);
  if (activeThemePath) {
    const text = await readTextFile(activeThemePath);
    const file = parseThemeJson(text);
    return resolveAdvanced(file);
  }
  return resolveDefaults();
};

export const useThemeStore = create<ThemeState>((set) => ({
  resolved: undefined,
  applyFromSettings: async () => {
    const resolved = await resolveFromSettings();
    set({ resolved });
    applyTheme(resolved);
  },
  setTier: async (tier) => {
    await coreSettingsHost.set('theme.tier', tier);
    await useThemeStore.getState().applyFromSettings();
  },
  setPrimary: async (primary) => {
    await coreSettingsHost.set('theme.primary', primary);
    await useThemeStore.getState().applyFromSettings();
  },
  setActiveThemePath: async (path) => {
    await coreSettingsHost.set('theme.activeThemePath', path ?? '');
    await useThemeStore.getState().applyFromSettings();
  },
}));

export const initializeThemeStore = async () => {
  await useThemeStore.getState().applyFromSettings();
};
