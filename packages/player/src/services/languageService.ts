import { i18n } from '@nuclearplayer/i18n';

import { coreSettingsHost, getSetting } from '../stores/settingsStore';

export const changeLanguage = async (locale: string) => {
  await i18n.changeLanguage(locale);
};

export const applyLanguageFromSettings = async () => {
  const savedLanguage = getSetting('core.general.language');
  if (savedLanguage && typeof savedLanguage === 'string') {
    await changeLanguage(savedLanguage);
  }
};

export const initLanguageWatcher = () => {
  coreSettingsHost.subscribe('core.general.language', (value) => {
    if (value && typeof value === 'string') {
      void changeLanguage(value);
    }
  });
};
