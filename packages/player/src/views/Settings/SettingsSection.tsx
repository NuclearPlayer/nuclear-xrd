import { FC } from 'react';

import { useSetting, type SettingDefinition } from '@nuclearplayer/plugin-sdk';
import { SectionShell } from '@nuclearplayer/ui';

import { coreSettingsHost } from '../../services/settingsHost';
import { SettingField } from './SettingField';

type SettingsSectionProps = {
  title: string;
  settings: SettingDefinition[];
};

export const SettingsSection: FC<SettingsSectionProps> = ({
  title,
  settings,
}) => (
  <SectionShell title={title}>
    <div className="flex flex-col gap-6">
      {settings.map((definition) => {
        const [value, setValue] = useSetting(coreSettingsHost, definition.id);
        return (
          <SettingField
            key={definition.id}
            definition={definition}
            value={value}
            setValue={setValue}
          />
        );
      })}
    </div>
  </SectionShell>
);
