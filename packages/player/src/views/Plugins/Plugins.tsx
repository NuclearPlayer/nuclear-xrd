import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Tabs, ViewShell } from '@nuclearplayer/ui';

import { InstalledPlugins } from './InstalledPlugins';
import { PluginStore } from './PluginStore';

export const Plugins: FC = () => {
  const { t } = useTranslation('plugins');

  return (
    <ViewShell title={t('title')}>
      <Tabs
        className="flex flex-1 flex-col overflow-hidden"
        panelsClassName="flex-1 overflow-hidden"
        panelClassName="flex flex-1 overflow-hidden"
        items={[
          {
            id: 'installed',
            label: t('tabs.installed'),
            content: <InstalledPlugins />,
          },
          {
            id: 'store',
            label: t('tabs.store'),
            content: <PluginStore />,
          },
        ]}
      />
    </ViewShell>
  );
};
