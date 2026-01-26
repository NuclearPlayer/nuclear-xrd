import { open } from '@tauri-apps/plugin-dialog';
import isString from 'lodash-es/isString';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, PluginItem, ScrollableArea, Toggle } from '@nuclearplayer/ui';

import { PluginIconComponent } from '../../components/PluginIcon';
import { usePluginStore } from '../../stores/pluginStore';
import { useStartupStore } from '../../stores/startupStore';

export const InstalledPlugins: FC = () => {
  const { t } = useTranslation('plugins');
  const startupStore = useStartupStore();
  const store = usePluginStore();
  const plugins = store.getAllPlugins();

  const handleAdd = async () => {
    const path = await open({ directory: true, multiple: false });
    if (isString(path)) {
      await store.loadPluginFromPath(path);
    }
  };

  return (
    <div className="relative flex w-full flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center">
        <Button onClick={handleAdd} size="sm">
          {t('addPlugin')}
        </Button>
      </div>
      <ScrollableArea className="flex-1 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-visible px-2 py-2">
          {plugins.map((p) => (
            <PluginItem
              key={p.metadata.id}
              icon={<PluginIconComponent icon={p.metadata.icon} />}
              name={p.metadata.displayName}
              author={p.metadata.author}
              description={p.metadata.description}
              disabled={!p.enabled}
              warning={p.warning}
              warningText={p.warnings.length > 0 ? p.warnings[0] : undefined}
              isLoading={p.isLoading}
              onReload={async () => {
                if (p.installationMethod === 'dev') {
                  await store.reloadPlugin(p.metadata.id);
                }
              }}
              onRemove={async () => {
                await store.removePlugin(p.metadata.id);
              }}
              rightAccessory={
                <Toggle
                  data-testid={`toggle-enable-plugin-${p.metadata.id}`}
                  data-enabled={p.enabled}
                  checked={p.enabled}
                  onChange={(checked) =>
                    checked
                      ? store.enablePlugin(p.metadata.id)
                      : store.disablePlugin(p.metadata.id)
                  }
                  aria-label={`Toggle ${p.metadata.displayName}`}
                />
              }
              loadTimeMs={startupStore.pluginDurations[p.metadata.id]}
            />
          ))}
        </div>
      </ScrollableArea>
    </div>
  );
};
