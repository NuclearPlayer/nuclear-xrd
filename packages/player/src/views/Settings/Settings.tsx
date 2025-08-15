import { ScrollableArea, ViewShell } from '@nuclearplayer/ui';

import { SettingsSection } from './SettingsSection';
import { capitalize, useSettingsGroups } from './useSettingsGroups';

export const Settings = () => {
  const groups = useSettingsGroups();

  return (
    <ViewShell title="Settings">
      <ScrollableArea className="mt-6 max-w-100 flex-1 overflow-hidden">
        {groups.map((group) => (
          <SettingsSection
            key={group.name}
            title={capitalize(group.name)}
            settings={group.settings}
          />
        ))}
      </ScrollableArea>
    </ViewShell>
  );
};
