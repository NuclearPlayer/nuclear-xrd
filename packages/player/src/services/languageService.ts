import { i18n } from '@nuclearplayer/i18n';

import { coreSettingsHost } from '../stores/settingsStore';

export const changeLanguage = async (locale: string) => {
  await i18n.changeLanguage(locale);
};

export const applyLanguageFromSettings = async () => {
  const savedLanguage = await coreSettingsHost.get<string>('general.language');
  if (savedLanguage && typeof savedLanguage === 'string') {
    await changeLanguage(savedLanguage);
  }
};

export const initLanguageWatcher = () => {
  coreSettingsHost.subscribe('general.language', (value) => {
    if (value && typeof value === 'string') {
      void changeLanguage(value);
    }
  });
};
