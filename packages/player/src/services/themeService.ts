import { clearAdvancedTheme, setThemeId } from '@nuclearplayer/themes';

import { setSetting } from '../stores/settingsStore';

export const setAndPersistThemeId = async (id: string): Promise<void> => {
  clearAdvancedTheme();
  setThemeId(id);
  await setSetting('core.theme.id', id);
  await setSetting('core.theme.mode', 'basic');
  await setSetting('core.theme.advanced.path', '');
};

export const resetToDefaultTheme = async (): Promise<void> => {
  clearAdvancedTheme();
  setThemeId('');
  await setSetting('core.theme.id', '');
  await setSetting('core.theme.mode', 'basic');
  await setSetting('core.theme.advanced.path', '');
};
