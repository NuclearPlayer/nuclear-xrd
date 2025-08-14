import { FC } from 'react';

import { useSetting, type SettingDefinition } from '@nuclearplayer/plugin-sdk';

import { coreSettingsHost } from '../../stores/settingsStore';
import { SettingField } from './SettingField';

type SettingsSectionProps = {
  title: string;
  settings: SettingDefinition[];
};

export const SettingsSection: FC<SettingsSectionProps> = ({
  title,
  settings,
}) => (
  <section className="flex flex-col gap-4 px-2">
    <h2 className="text-foreground text-lg font-semibold">{title}</h2>
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
  </section>
);
