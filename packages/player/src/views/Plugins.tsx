import * as Lucide from 'lucide-react';

import { PluginIcon } from '@nuclearplayer/plugin-sdk';
import { PluginItem, ViewShell } from '@nuclearplayer/ui';

import { usePluginStore } from '../stores/pluginStore';

const resolveIcon = (pluginIcon: unknown) => {
  if (!pluginIcon || typeof pluginIcon !== 'object') return null;
  const icon = pluginIcon as PluginIcon;
  if (icon.type === 'named') {
    const name = icon.name;
    if (name && name in Lucide) {
      const Cmp = (Lucide as Record<string, unknown>)[
        name
      ] as React.ComponentType<{ size?: number }>;
      return <Cmp size={20} />;
    }
  }
  if (icon.type === 'link' && typeof icon.link === 'string') {
    return (
      <img
        src={icon.link}
        alt="plugin icon"
        className="w-5 h-5 object-contain"
        draggable={false}
      />
    );
  }
  return null;
};

export const Plugins = () => {
  const plugins = usePluginStore().getAllPlugins();
  return (
    <ViewShell title="Plugins">
      <div className="flex flex-col my-6 gap-4">
        {plugins.map((p) => (
          <PluginItem
            key={p.metadata.id}
            icon={resolveIcon(p.metadata.icon)}
            name={p.metadata.displayName}
            author={p.metadata.author}
            description={p.metadata.description}
            onViewDetails={() => {}}
          />
        ))}
      </div>
    </ViewShell>
  );
};
