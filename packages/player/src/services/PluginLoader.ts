import { join } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';

import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';
import type { NuclearPlugin } from '@nuclearplayer/plugin-sdk';

export type PluginManifest = {
  name: string;
  version: string;
};

export type LoadedPlugin = {
  id: string;
  name: string;
  version: string;
  path: string;
  instance: NuclearPlugin;
};

export class PluginLoader {
  private path: string;
  private manifest?: PluginManifest;
  private pluginCode?: string;

  constructor(path: string) {
    this.path = path;
  }

  async readManifest(): Promise<PluginManifest> {
    const packageJsonPath = await join(this.path, 'package.json');
    const packageJsonContent = await readTextFile(packageJsonPath);
    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.name || !packageJson.version) {
      throw new Error('Plugin package.json must contain name and version');
    }

    this.manifest = {
      name: packageJson.name,
      version: packageJson.version,
    };

    return this.manifest;
  }

  async readPluginCode(): Promise<string> {
    const pluginModulePath = await join(this.path, 'dist', 'index.js');
    this.pluginCode = await readTextFile(pluginModulePath);
    return this.pluginCode;
  }

  evaluatePlugin(code: string): NuclearPlugin {
    const exports = {};
    const module = { exports };
    const ALLOWED_MODULES: Record<string, unknown> = {
      '@nuclearplayer/plugin-sdk': { NuclearPluginAPI },
    };
    const require = (id: string) => {
      if (id in ALLOWED_MODULES) return ALLOWED_MODULES[id];
      throw new Error(`Module ${id} not found`);
    };

    new Function('exports', 'module', 'require', code)(
      exports,
      module,
      require,
    );

    // @ts-expect-error exports are actually unknown
    const plugin = (module.exports as unknown).default || module.exports;

    if (!plugin || typeof plugin !== 'object') {
      throw new Error(
        'Plugin must export a default object implementing NuclearPlugin interface',
      );
    }

    if (!plugin.name || !plugin.version) {
      throw new Error('Plugin must have name and version properties');
    }

    return plugin;
  }

  async load(): Promise<LoadedPlugin> {
    const manifest = await this.readManifest();
    const code = await this.readPluginCode();
    const plugin = this.evaluatePlugin(code);
    if (plugin.onLoad) {
      const api = new NuclearPluginAPI();
      await plugin.onLoad(api);
    }

    return {
      id: manifest.name,
      name: manifest.name,
      version: manifest.version,
      path: this.path,
      instance: plugin,
    };
  }
}
