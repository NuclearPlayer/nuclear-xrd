import { open } from '@tauri-apps/plugin-dialog';

import { Button, PluginItem, Toggle, ViewShell } from '@nuclearplayer/ui';

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
      <div className="flex flex-col gap-6 my-6">
        <div className="flex items-center gap-4">
          <Button onClick={handleAdd} size="sm">
            Add Plugin
          </Button>
        </div>
        <div className="flex flex-col gap-4">
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
      </div>
    </ViewShell>
  );
};
