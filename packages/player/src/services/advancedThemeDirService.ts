import { join } from '@tauri-apps/api/path';
import { readDir, readTextFile, watch } from '@tauri-apps/plugin-fs';
import { toast } from 'sonner';

import { parseAdvancedTheme } from '@nuclearplayer/themes';

import type { AdvancedThemeFile } from '../stores/advancedThemeStore';
import { useAdvancedThemeStore } from '../stores/advancedThemeStore';
import { useSettingsStore } from '../stores/settingsStore';
import { logFsError } from '../utils/logging';
import { ensureDir } from '../utils/path';
import { loadAndApplyAdvancedThemeFromFile } from './advancedThemeService';

let unwatch: (() => void) | null = null;

export const THEMES_DIR_NAME = 'themes';

export const ensureThemesDir = async (): Promise<string> => {
  return ensureDir(THEMES_DIR_NAME);
};

export const listAdvancedThemes = async (): Promise<AdvancedThemeFile[]> => {
  const dir = await ensureThemesDir();
  let entries: Array<{ name?: string; isDirectory?: boolean }> = [];
  try {
    entries = await readDir(dir);
  } catch (e) {
    await logFsError('themes', 'fs.readDir', dir, e);
    return [];
  }
  const themes: AdvancedThemeFile[] = [];
  for (const e of entries) {
    if (e.isDirectory) continue;
    const name = e.name ?? '';
    if (!name.toLowerCase().endsWith('.json')) continue;
    const path = await join(dir, name);
    try {
      const text = await readTextFile(path);
      const json = JSON.parse(text);
      const parsed = parseAdvancedTheme(json);
      themes.push({ path, name: parsed.name });
    } catch (e) {
      await logFsError('themes', 'fs.readTextFile', path, e);
    }
  }
  themes.sort((a, b) => a.name.localeCompare(b.name));
  return themes;
};

export const refreshAdvancedThemeList = async (): Promise<void> => {
  const themes = await listAdvancedThemes();
  useAdvancedThemeStore.getState().setThemes(themes);
};

export const startAdvancedThemeWatcher = async (): Promise<void> => {
  const dir = await ensureThemesDir();
  await refreshAdvancedThemeList();
  if (unwatch) return;
  try {
    unwatch = await watch(dir, async (event) => {
      await refreshAdvancedThemeList();

      const state = useSettingsStore.getState();
      const mode = state.getValue('core.theme.mode');
      const currentPath = state.getValue('core.theme.advanced.path');

      if (
        mode !== 'advanced' ||
        typeof currentPath !== 'string' ||
        !currentPath
      ) {
        return;
      }

      if (!event.paths.some((p) => p === currentPath)) {
        return;
      }

      try {
        await loadAndApplyAdvancedThemeFromFile(currentPath);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        toast.error('Theme reload failed', { description: msg });
        await logFsError('themes', 'fs.watch', currentPath, e);
      }
    });
  } catch (e) {
    await logFsError('themes', 'fs.watch', dir, e);
  }
};

export const stopAdvancedThemeWatcher = (): void => {
  if (unwatch) {
    unwatch();
    unwatch = null;
  }
};
