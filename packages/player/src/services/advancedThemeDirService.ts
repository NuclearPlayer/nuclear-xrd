import { appDataDir, join } from '@tauri-apps/api/path';
import {
  exists,
  mkdir,
  readDir,
  readTextFile,
  watch,
} from '@tauri-apps/plugin-fs';
import { error as logError } from '@tauri-apps/plugin-log';
import { toast } from 'sonner';

import { parseAdvancedTheme } from '@nuclearplayer/themes';

import type { AdvancedThemeFile } from '../stores/advancedThemeStore';
import { useAdvancedThemeStore } from '../stores/advancedThemeStore';

let unwatch: (() => void) | null = null;

const reportFsError = async (
  cmd: string,
  targetPath: string,
  err: unknown,
): Promise<void> => {
  const msg = err instanceof Error ? err.message : String(err);
  toast.error(cmd, { description: msg });
  await logError(`[themes/fs] ${cmd} failed for ${targetPath}: ${msg}`);
};

export const getThemesDir = async (): Promise<string> => {
  const base = await appDataDir();
  return join(base, 'themes');
};

export const ensureThemesDir = async (): Promise<string> => {
  const dir = await getThemesDir();
  try {
    const present = await exists(dir);
    if (!present) {
      try {
        await mkdir(dir, { recursive: true });
      } catch (e) {
        await reportFsError('fs.mkdir', dir, e);
      }
    }
  } catch (e) {
    await reportFsError('fs.exists', dir, e);
  }
  return dir;
};

export const listAdvancedThemes = async (): Promise<AdvancedThemeFile[]> => {
  const dir = await ensureThemesDir();
  let entries: Array<{ name?: string; isDirectory?: boolean }> = [];
  try {
    entries = await readDir(dir);
  } catch (e) {
    await reportFsError('fs.readDir', dir, e);
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
      await reportFsError('fs.readTextFile', path, e);
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
    unwatch = await watch(dir, async () => {
      await refreshAdvancedThemeList();
    });
  } catch (e) {
    await reportFsError('fs.watch', dir, e);
  }
};

export const stopAdvancedThemeWatcher = (): void => {
  if (unwatch) {
    unwatch();
    unwatch = null;
  }
};
