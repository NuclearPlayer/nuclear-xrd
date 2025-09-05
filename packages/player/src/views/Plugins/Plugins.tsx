import { open } from '@tauri-apps/plugin-dialog';
import isString from 'lodash-es/isString';
import map from 'lodash-es/map';
import { FC } from 'react';

import {
  Button,
  PluginItem,
  ScrollableArea,
  Toggle,
  ViewShell,
} from '@nuclearplayer/ui';

import { PluginIconComponent } from '../../components/PluginIcon';
import { usePluginStore } from '../../stores/pluginStore';
import { useStartupStore } from '../../stores/startupStore';

export const Plugins: FC = () => {
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
    <ViewShell title="Plugins">
      <div className="flex flex-col">
        <span>Startup time: {startupStore.totalStartupTimeMs}ms</span>
        <span>Plugin count: {plugins.length}</span>
        <span className="flex flex-col">
          {map(startupStore.pluginDurations, (value, key) => (
            <span key={key}>
              {key}: {value}ms
            </span>
          ))}
        </span>
      </div>
      <div className="relative flex w-full flex-col gap-4 overflow-hidden">
        <div className="flex items-center">
          <Button onClick={handleAdd} size="sm">
            Add Plugin
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
                rightAccessory={
                  <Toggle
                    data-testid={`toggle-enable-plugin`}
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
              />
            ))}
          </div>
        </ScrollableArea>
      </div>
    </ViewShell>
  );
};
