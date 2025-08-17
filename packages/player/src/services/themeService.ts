import { setThemeId } from '@nuclearplayer/themes';

import { setSetting } from '../stores/settingsStore';

export const setAndPersistThemeId = async (id: string): Promise<void> => {
  setThemeId(id);
  await setSetting('core.theme.id', id);
};
