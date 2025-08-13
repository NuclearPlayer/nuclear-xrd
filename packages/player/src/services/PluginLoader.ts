import { join } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';

import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';
import type {
  LoadedPlugin,
  NuclearPlugin,
  PluginManifest,
  PluginMetadata,
} from '@nuclearplayer/plugin-sdk';

import { createPluginSettingsHost } from '../stores/settingsStore';
import { compilePlugin } from './pluginCompiler';
import { safeParsePluginManifest } from './pluginManifest';

export class PluginLoader {
  private path: string;
  private manifest?: PluginManifest;
  private entryPath?: string;
  private pluginCode?: string;
  private warnings: string[] = [];

  constructor(path: string) {
    this.path = path;
  }

  private async readRawPackageJson(): Promise<unknown> {
    const packageJsonPath = await join(this.path, 'package.json');
    const packageJsonContent = await readTextFile(packageJsonPath);
    return JSON.parse(packageJsonContent);
  }

  private buildMetadata(manifest: PluginManifest): PluginMetadata {
    return {
      id: manifest.name,
      name: manifest.name,
      displayName: manifest.nuclear?.displayName || manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author,
      category: manifest.nuclear?.category,
      icon: manifest.nuclear?.icon,
      permissions: manifest.nuclear?.permissions || [],
    };
  }

  private async resolveEntryPath(manifest: PluginManifest): Promise<string> {
    if (manifest.main) {
      return join(this.path, manifest.main);
    }
    const candidates = [
      'index.js',
      'index.ts',
      'index.tsx',
      'dist/index.js',
      'dist/index.ts',
      'dist/index.tsx',
    ];
    for (const candidate of candidates) {
      try {
        const full = await join(this.path, candidate);
        await readTextFile(full);
        return full;
      } catch {
        /* Do nothing */
      }
    }
    throw new Error(
      'Could not resolve plugin entry file (main, index.js, index.ts, index.tsx, dist/index.js, dist/index.ts, dist/index.tsx)',
    );
  }

  private async readManifest(): Promise<PluginManifest> {
    const raw = await this.readRawPackageJson();
    const res = safeParsePluginManifest(raw);
    if (!res.success) {
      const msg = res.errors.join('; ');
      throw new Error(`Invalid package.json: ${msg}`);
    }
    this.warnings = res.warnings;
    this.manifest = res.data;
    return this.manifest;
  }

  private async readPluginCode(entryPath: string): Promise<string> {
    const compiled = await compilePlugin(entryPath);
    if (compiled != null) {
      this.pluginCode = compiled;
      return compiled;
    }
    this.pluginCode = await readTextFile(entryPath);
    return this.pluginCode;
  }

  private evaluatePlugin(code: string): NuclearPlugin {
    const exports = {} as Record<string, unknown>;
    const module = { exports } as { exports: unknown };
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
      throw new Error('Plugin must export a default object.');
    }
    return plugin as NuclearPlugin;
  }

  async load(): Promise<LoadedPlugin> {
    const manifest = await this.readManifest();
    const metadata = this.buildMetadata(manifest);
    this.entryPath = await this.resolveEntryPath(manifest);
    const code = await this.readPluginCode(this.entryPath);
    const instance = this.evaluatePlugin(code);
    if (instance.onLoad) {
      const api = new NuclearPluginAPI({
        settingsHost: createPluginSettingsHost(
          metadata.id,
          metadata.displayName,
        ),
      });
      await instance.onLoad(api);
    }
    return {
      metadata,
      instance,
      path: this.path,
    };
  }

  getWarnings(): string[] {
    return this.warnings;
  }
}
