import { PluginItem, ViewShell } from '@nuclearplayer/ui';

import { usePluginStore } from '../stores/pluginStore';

export const Plugins = () => {
  const plugins = usePluginStore().getAllPlugins();
  return (
    <ViewShell title="Plugins">
      <div className="flex flex-col my-6 gap-4">
        {plugins.map((plugin) => (
          <PluginItem
            icon={plugin.icon}
            name={plugin.name}
            author={plugin.author}
            description={plugin.description}
            onViewDetails={() => {}}
          />
        ))}
      </div>
    </ViewShell>
  );
};
