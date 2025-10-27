import { useTranslation } from 'react-i18next';

import type { SettingDefinition } from '@nuclearplayer/plugin-sdk';

export const useSettingTranslation = (definition: SettingDefinition) => {
  const { t } = useTranslation('settings', { useSuspense: false });

  const translateField = (field: string | undefined): string | undefined => {
    if (!field) {
      return undefined;
    }

    if (!field.startsWith('settings.')) {
      return field;
    }

    const key = field.replace('settings.', '');
    const translated = t(key, { defaultValue: field });

    return translated === field ? field : translated;
  };

  return {
    title: translateField(definition.title) ?? definition.title,
    description: translateField(definition.description),
  };
};
