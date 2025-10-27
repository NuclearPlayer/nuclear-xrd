import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en_US from './locales/en_US.json';

export const resources = {
  en: en_US,
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: [
    'common',
    'navigation',
    'search',
    'artist',
    'themes',
    'settings',
    'dashboard',
    'plugins',
  ],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: true,
  },
});

export default i18n;
