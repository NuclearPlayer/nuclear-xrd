import type { NuclearPluginAPI } from './api';

export type NuclearPlugin = {
  name: string;
  version: string;
  onLoad?(api: NuclearPluginAPI): void | Promise<void>;
  onUnload?(): void | Promise<void>;
  onEnable?(api: NuclearPluginAPI): void | Promise<void>;
  onDisable?(): void | Promise<void>;
};
