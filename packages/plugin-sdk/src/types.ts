import type { NuclearPluginAPI } from './api';

export type PluginIcon = { type: 'link'; link: string };

export type PluginManifest = {
  name: string;
  version: string;
  description: string;
  author: string;
  main?: string;
  nuclear?: {
    displayName?: string;
    category?: string;
    icon?: PluginIcon;
    permissions?: string[];
  };
};

export type NuclearPlugin = {
  onLoad?(api: NuclearPluginAPI): void | Promise<void>;
  onUnload?(): void | Promise<void>;
  onEnable?(api: NuclearPluginAPI): void | Promise<void>;
  onDisable?(): void | Promise<void>;
};

export type PluginMetadata = {
  id: string;
  name: string;
  displayName: string;
  version: string;
  description: string;
  author: string;
  category?: string;
  icon?: PluginIcon;
  permissions: string[];
};

export type LoadedPlugin = {
  metadata: PluginMetadata;
  instance: NuclearPlugin;
  path: string;
};
