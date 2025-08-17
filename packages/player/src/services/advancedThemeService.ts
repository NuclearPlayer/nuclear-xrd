import { readTextFile } from '@tauri-apps/plugin-fs';

import {
  applyAdvancedTheme,
  parseAdvancedTheme,
  setThemeId,
} from '@nuclearplayer/themes';

import { setSetting, useSettingsStore } from '../stores/settingsStore';

export const loadAndApplyAdvancedThemeFromFile = async (
  path: string,
): Promise<void> => {
  const contents = await readTextFile(path);
  const json = JSON.parse(contents);
  const theme = parseAdvancedTheme(json);
  setThemeId('');
  applyAdvancedTheme(theme);
  await setSetting('core.theme.mode', 'advanced');
  await setSetting('core.theme.advanced.path', path);
};

export const applyAdvancedThemeFromSettingsIfAny = async (): Promise<void> => {
  const mode = useSettingsStore.getState().getValue('core.theme.mode');
  const path = useSettingsStore.getState().getValue('core.theme.advanced.path');
  if (mode === 'advanced' && typeof path === 'string' && path) {
    try {
      setThemeId('');
      await loadAndApplyAdvancedThemeFromFile(path);
    } catch {
      // ignore failures; user can re-pick a file in the UI
    }
  }
};
