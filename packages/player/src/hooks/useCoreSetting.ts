import { useSetting } from '@nuclearplayer/plugin-sdk';
import type { SettingValue } from '@nuclearplayer/plugin-sdk';

import { coreSettingsHost } from '../stores/settingsStore';

export const useCoreSetting = <T extends SettingValue = SettingValue>(
  id: string,
) => useSetting<T>(coreSettingsHost, id);
