import { setThemeId } from '@nuclearplayer/themes';

import { useSettingsStore } from '../stores/settingsStore';

export const applyThemeFromSettings = async (): Promise<void> => {
  const id = useSettingsStore.getState().getValue('core.theme.id');
  if (typeof id === 'string' && id) setThemeId(id);
};
