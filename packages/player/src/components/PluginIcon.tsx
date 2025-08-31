import { PluginIcon } from '@nuclearplayer/plugin-sdk';

interface PluginIconComponentProps {
  icon: PluginIcon | undefined;
}

export const PluginIconComponent = ({ icon }: PluginIconComponentProps) => {
  if (!icon || typeof icon !== 'object') {
    return null;
  }

  if (icon.type === 'link' && typeof icon.link === 'string') {
    return (
      <img
        src={icon.link}
        alt="plugin icon"
        className="h-full w-full object-contain"
        draggable={false}
      />
    );
  }

  return null;
};
