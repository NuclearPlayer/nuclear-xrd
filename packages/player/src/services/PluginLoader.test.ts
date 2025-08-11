import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PluginLoader } from './PluginLoader';

vi.mock('@tauri-apps/api/path', () => ({
  join: vi.fn((...parts: string[]) => Promise.resolve(parts.join('/'))),
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

  const baseManifest = {
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test description',
    author: 'Tester',
  } as const;

  const makeManifest = (
    overrides: Partial<
      typeof baseManifest & { main?: string; nuclear?: unknown }
    > = {},
  ) => ({
    ...baseManifest,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    loader = new PluginLoader('/test/plugin/path');
  });

  describe('manifest validation via load()', () => {
    it('parses manifest with required fields', async () => {
      const manifest = makeManifest();
      const pluginCode = 'module.exports = { onLoad(){} };';
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockResolvedValueOnce(pluginCode);
      const result = await loader.load();
      expect(result.metadata).toMatchObject({
        id: manifest.name,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        author: manifest.author,
      });
    });

    it('throws if name missing', async () => {
      const manifest = { ...baseManifest } as Record<string, unknown>;
      delete manifest.name;
      mockReadTextFile.mockResolvedValueOnce(JSON.stringify(manifest));
      await expect(loader.load()).rejects.toThrow(
        'package.json missing required field: name',
      );
    });

    it('throws if version missing', async () => {
      const manifest = { ...baseManifest } as Record<string, unknown>;
      delete manifest.version;
      mockReadTextFile.mockResolvedValueOnce(JSON.stringify(manifest));
      await expect(loader.load()).rejects.toThrow(
        'package.json missing required field: version',
      );
    });

    it('throws if description missing', async () => {
      const manifest = { ...baseManifest } as Record<string, unknown>;
      delete manifest.description;
      mockReadTextFile.mockResolvedValueOnce(JSON.stringify(manifest));
      await expect(loader.load()).rejects.toThrow(
        'package.json missing required field: description',
      );
    });

    it('throws if author missing', async () => {
      const manifest = { ...baseManifest } as Record<string, unknown>;
      delete manifest.author;
      mockReadTextFile.mockResolvedValueOnce(JSON.stringify(manifest));
      await expect(loader.load()).rejects.toThrow(
        'package.json missing required field: author',
      );
    });
  });

  describe('entry resolution', () => {
    it('uses main field path', async () => {
      const manifest = makeManifest({ main: 'custom/entry.js' });
      const code = 'module.exports = { onLoad(){} };';
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockResolvedValueOnce(code); // readPluginCode only (no pre-read)
      const result = await loader.load();
      expect(result.instance).toBeDefined();
      expect(mockReadTextFile).toHaveBeenNthCalledWith(
        2,
        '/test/plugin/path/custom/entry.js',
      );
    });

    it('falls back to dist/index.js when index.js missing', async () => {
      const manifest = makeManifest();
      const code = 'module.exports = { onEnable(){} };';
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockRejectedValueOnce(new Error('not found')) // index.js existence check
        .mockResolvedValueOnce(code) // dist/index.js existence check
        .mockResolvedValueOnce(code); // actual read
      const result = await loader.load();
      expect(result.instance).toBeDefined();
      expect(mockReadTextFile).toHaveBeenLastCalledWith(
        '/test/plugin/path/dist/index.js',
      );
    });

    it('throws if no entry file found', async () => {
      const manifest = makeManifest();
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockRejectedValueOnce(new Error('not found')) // index.js
        .mockRejectedValueOnce(new Error('not found')); // dist/index.js
      await expect(loader.load()).rejects.toThrow(
        'Could not resolve plugin entry file',
      );
    });
  });

  describe('plugin code evaluation via load()', () => {
    it('returns hooks object', async () => {
      const manifest = makeManifest();
      const code = 'module.exports = { onLoad(){} };';
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockRejectedValueOnce(new Error('not found'))
        .mockResolvedValueOnce(code)
        .mockResolvedValueOnce(code);
      const result = await loader.load();
      expect(result.instance).toHaveProperty('onLoad');
    });

    it('supports default export', async () => {
      const manifest = makeManifest();
      const code = 'module.exports.default = { onEnable(){} };';
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockRejectedValueOnce(new Error('not found'))
        .mockResolvedValueOnce(code)
        .mockResolvedValueOnce(code);
      const result = await loader.load();
      expect(result.instance).toHaveProperty('onEnable');
    });

    it('throws on non-object export', async () => {
      const manifest = makeManifest();
      const code = 'module.exports = "not an object";';
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockRejectedValueOnce(new Error('not found'))
        .mockResolvedValueOnce(code)
        .mockResolvedValueOnce(code);
      await expect(loader.load()).rejects.toThrow(
        'Plugin must export a default object (hooks).',
      );
    });

    it('provides limited require for plugin-sdk', async () => {
      const manifest = makeManifest();
      const code =
        "const { NuclearPluginAPI } = require('@nuclearplayer/plugin-sdk'); module.exports = { testAdd: NuclearPluginAPI.add() };";
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockRejectedValueOnce(new Error('not found'))
        .mockResolvedValueOnce(code)
        .mockResolvedValueOnce(code);
      const result = await loader.load();
      expect('testAdd' in result.instance).toBe(true);
    });

    it('throws for unknown required modules', async () => {
      const manifest = makeManifest();
      const code = "require('unknown-module'); module.exports = {};";
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockRejectedValueOnce(new Error('not found'))
        .mockResolvedValueOnce(code)
        .mockResolvedValueOnce(code);
      await expect(loader.load()).rejects.toThrow(
        'Module unknown-module not found',
      );
    });
  });

  describe('load metadata assembly', () => {
    it('builds metadata including nuclear section', async () => {
      const manifest = makeManifest({
        nuclear: {
          displayName: 'Display Name',
          category: 'integration',
          permissions: ['net'],
        },
      });
      const code = 'module.exports = { onLoad(){} };';
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest))
        .mockRejectedValueOnce(new Error('not found'))
        .mockResolvedValueOnce(code)
        .mockResolvedValueOnce(code);
      const result = await loader.load();
      expect(result.metadata).toMatchObject({
        id: 'test-plugin',
        displayName: 'Display Name',
        category: 'integration',
        permissions: ['net'],
      });
    });
  });

  describe('typescript plugin compilation', () => {
    it('compiles and loads a .ts plugin', async () => {
      const manifest = makeManifest({ main: 'index.ts' });
      const tsCode = 'export default { onLoad(){} };';
      mockReadTextFile
        .mockResolvedValueOnce(JSON.stringify(manifest)) // manifest
        .mockResolvedValueOnce(tsCode); // ts entry source
      const result = await loader.load();
      expect(result.instance).toHaveProperty('onLoad');
    });
  });
});
