import * as Lucide from 'lucide-react';

import { PluginIcon } from '@nuclearplayer/plugin-sdk';

interface PluginIconComponentProps {
  icon: PluginIcon | undefined;
}

export const PluginIconComponent = ({ icon }: PluginIconComponentProps) => {
  if (!icon || typeof icon !== 'object') return null;

  if (icon.type === 'named') {
    const name = icon.name;
    if (name && name in Lucide) {
      const Cmp = (Lucide as Record<string, unknown>)[
        name
      ] as React.ComponentType<{ size?: number }>;

      return (
        <div
          className={`flex h-full w-full items-center justify-center bg-${icon.background}`}
        >
          <Cmp size={20} />
        </div>
      );
    }
  }

  if (icon.type === 'link' && typeof icon.link === 'string') {
    return (
      <img
        src={icon.link}
        alt="plugin icon"
        className="h-5 w-5 object-contain"
        draggable={false}
      />
    );
  }

  return null;
};
