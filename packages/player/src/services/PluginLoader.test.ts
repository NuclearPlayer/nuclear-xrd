import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PluginLoader } from './PluginLoader';

vi.mock('@tauri-apps/api/path', () => ({
  join: vi.fn((...parts) => Promise.resolve(parts.join('/'))),
}));

vi.mock('@tauri-apps/plugin-fs', () => ({
  readTextFile: vi.fn(),
}));

const mockNuclearPluginAPI = vi.fn();
vi.mock('@nuclearplayer/plugin-sdk', () => ({
  NuclearPluginAPI: class MockNuclearPluginAPI {
    constructor() {
      mockNuclearPluginAPI();
    }
    static add() {
      return 2 + 2;
    }
  },
}));

const mockReadTextFile = vi.mocked(
  await import('@tauri-apps/plugin-fs'),
).readTextFile;

describe('PluginLoader', () => {
  let loader: PluginLoader;

  beforeEach(() => {
    vi.clearAllMocks();
    loader = new PluginLoader('/test/plugin/path');
  });

  describe('readManifest', () => {
    it('should read and parse package.json', async () => {
      const packageJson = {
        name: 'test-plugin',
        version: '1.0.0',
      };
      mockReadTextFile.mockResolvedValue(JSON.stringify(packageJson));

      const manifest = await loader.readManifest();

      expect(manifest).toEqual({
        name: 'test-plugin',
        version: '1.0.0',
      });
      expect(mockReadTextFile).toHaveBeenCalledWith(
        '/test/plugin/path/package.json',
      );
    });

    it('should throw error if name is missing', async () => {
      const packageJson = { version: '1.0.0' };
      mockReadTextFile.mockResolvedValue(JSON.stringify(packageJson));

      await expect(loader.readManifest()).rejects.toThrow(
        'Plugin package.json must contain name and version',
      );
    });

    it('should throw error if version is missing', async () => {
      const packageJson = { name: 'test-plugin' };
      mockReadTextFile.mockResolvedValue(JSON.stringify(packageJson));

      await expect(loader.readManifest()).rejects.toThrow(
        'Plugin package.json must contain name and version',
      );
    });
  });

  describe('readPluginCode', () => {
    it('should read plugin code from dist/index.js', async () => {
      const pluginCode = 'module.exports = { name: "test", version: "1.0.0" };';
      mockReadTextFile.mockResolvedValue(pluginCode);

      const code = await loader.readPluginCode();

      expect(code).toBe(pluginCode);
      expect(mockReadTextFile).toHaveBeenCalledWith(
        '/test/plugin/path/dist/index.js',
      );
    });
  });

  describe('evaluatePlugin', () => {
    it('should evaluate plugin code and return plugin object', () => {
      const pluginCode = `
        module.exports = {
          name: 'test-plugin',
          version: '1.0.0',
          onLoad: function() {}
        };
      `;

      const plugin = loader.evaluatePlugin(pluginCode);

      expect(plugin).toEqual({
        name: 'test-plugin',
        version: '1.0.0',
        onLoad: expect.any(Function),
      });
    });

    it('should handle default exports', () => {
      const pluginCode = `
        module.exports.default = {
          name: 'test-plugin',
          version: '1.0.0'
        };
      `;

      const plugin = loader.evaluatePlugin(pluginCode);

      expect(plugin).toEqual({
        name: 'test-plugin',
        version: '1.0.0',
      });
    });

    it('should throw error if plugin is not an object', () => {
      const pluginCode = 'module.exports = "not an object";';

      expect(() => loader.evaluatePlugin(pluginCode)).toThrow(
        'Plugin must export a default object implementing NuclearPlugin interface',
      );
    });

    it('should throw error if plugin lacks name', () => {
      const pluginCode = 'module.exports = { version: "1.0.0" };';

      expect(() => loader.evaluatePlugin(pluginCode)).toThrow(
        'Plugin must have name and version properties',
      );
    });

    it('should throw error if plugin lacks version', () => {
      const pluginCode = 'module.exports = { name: "test" };';

      expect(() => loader.evaluatePlugin(pluginCode)).toThrow(
        'Plugin must have name and version properties',
      );
    });

    it('should provide require function for plugin-sdk', () => {
      const pluginCode = `
        const { NuclearPluginAPI } = require('@nuclearplayer/plugin-sdk');
        module.exports = {
          name: 'test-plugin',
          version: '1.0.0',
          api: NuclearPluginAPI
        };
      `;

      const plugin = loader.evaluatePlugin(pluginCode);

      // @ts-expect-error - mockNuclearPluginAPI is not a real class
      expect(plugin.api).toBeDefined();
      // @ts-expect-error - mockNuclearPluginAPI is not a real class
      expect(plugin.api.add()).toBe(4);
    });

    it('should throw error for unknown modules', () => {
      const pluginCode = `
        require('unknown-module');
        module.exports = { name: 'test', version: '1.0.0' };
      `;

      expect(() => loader.evaluatePlugin(pluginCode)).toThrow(
        'Module unknown-module not found',
      );
    });
  });

  describe('load', () => {
    it('should complete full loading process', async () => {
      const packageJson = {
        name: 'test-plugin',
        version: '1.0.0',
      };
      const pluginCode = `
        module.exports = {
          name: 'test-plugin',
          version: '1.0.0',
          onLoad: function() {}
        };
      `;

      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(packageJson))
        .mockResolvedValueOnce(pluginCode);

      const result = await loader.load();

      expect(result).toEqual({
        id: 'test-plugin',
        name: 'test-plugin',
        version: '1.0.0',
        path: '/test/plugin/path',
        instance: expect.objectContaining({
          name: 'test-plugin',
          version: '1.0.0',
          onLoad: expect.any(Function),
        }),
      });
    });
  });
});
