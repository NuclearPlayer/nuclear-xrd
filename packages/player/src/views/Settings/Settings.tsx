import { useTranslation } from '@nuclearplayer/i18n';
import { ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { SettingsSection } from './SettingsSection';
import { useSettingsGroups } from './useSettingsGroups';

export const Settings = () => {
  const { t } = useTranslation('settings');
  const groups = useSettingsGroups();

  return (
    <ViewShell title={t('title')}>
      <ScrollableArea className="max-w-100 flex-1 overflow-hidden">
        {groups.map((group) => (
          <SettingsSection
            key={group.name}
            title={t(`categories.${group.name}`, group.name)}
            settings={group.settings}
          />
        ))}
      </ScrollableArea>
    </ViewShell>
  );
};
