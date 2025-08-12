import { open } from '@tauri-apps/plugin-dialog';

import {
  Button,
  PluginItem,
  ScrollableArea,
  Toggle,
  ViewShell,
} from '@nuclearplayer/ui';

import { PluginIconComponent } from '../components/PluginIcon';
import { usePluginStore } from '../stores/pluginStore';

export const Plugins = () => {
  const store = usePluginStore();
  const plugins = store.getAllPlugins();

  const handleAdd = async () => {
    const path = await open({ directory: true, multiple: false });
    if (typeof path === 'string') {
      await store.loadPluginFromPath(path);
    }
  };

  return (
    <ViewShell title="Plugins">
      <div className="relative mt-6 flex w-full flex-col gap-4 overflow-hidden">
        <div className="flex items-center">
          <Button onClick={handleAdd} size="sm">
            Add Plugin
          </Button>
        </div>
        <ScrollableArea className="flex-1 overflow-hidden">
          <div className="flex flex-col gap-4 pr-1 pb-2">
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
                    checked={p.enabled}
                    onCheckedChange={(checked) =>
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
