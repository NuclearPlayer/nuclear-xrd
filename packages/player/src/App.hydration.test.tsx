import './test/mocks/plugin-fs';

import { hydratePluginsFromRegistry } from './services/plugins/pluginBootstrap';
import { usePluginStore } from './stores/pluginStore';
import { resetInMemoryTauriStore } from './test/utils/inMemoryTauriStore';
import { seedRegistryEntry } from './test/utils/seedPluginRegistry';
import { createPluginFolder } from './test/utils/testPluginFolder';
import { PluginsWrapper } from './views/Plugins/Plugins.test-wrapper';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('./test/utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

// These tests check what happens on program startup, when we're loading plugins from the managed dir
describe('App plugin hydration', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    usePluginStore.setState({ plugins: {} });
  });

  it('(Hydration) loads a disabled plugin from registry and shows it disabled', async () => {
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/plain/1.0.0',
      { id: 'plain', version: '1.0.0' },
    );

    await seedRegistryEntry({ id: 'plain', version: '1.0.0', enabled: false });

    await hydratePluginsFromRegistry();
    await PluginsWrapper.mount();

    const plugins = PluginsWrapper.getPlugins();
    expect(plugins).toHaveLength(1);
    expect(plugins[0].enabled).toBe(false);
  });

  it('(Hydration) loads an enabled plugin from registry and enables it', async () => {
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/enabled/1.0.0',
      { id: 'enabled', version: '1.0.0' },
    );
    await seedRegistryEntry({ id: 'enabled', enabled: true });

    await hydratePluginsFromRegistry();
    await PluginsWrapper.mount();

    const plugins = PluginsWrapper.getPlugins();
    expect(plugins.map((p) => ({ name: p.name, enabled: p.enabled })))
      .toMatchInlineSnapshot(`
      [
        {
          "enabled": true,
          "name": "enabled",
        },
      ]
    `);
    expect(plugins[0].enabled).toBe(true);
  });

  it('(Hydration) loads multiple plugins in installedAt ascending order', async () => {
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/second/1.0.0',
      { id: 'second', version: '1.0.0' },
    );
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/first/1.0.0',
      { id: 'first', version: '1.0.0' },
    );

    await seedRegistryEntry({
      id: 'second',
      installedAt: '2025-01-02T00:00:00.000Z',
      lastUpdatedAt: '2025-01-02T00:00:00.000Z',
    });
    await seedRegistryEntry({
      id: 'first',
      installedAt: '2025-01-01T00:00:00.000Z',
      lastUpdatedAt: '2025-01-01T00:00:00.000Z',
    });

    await hydratePluginsFromRegistry();
    await PluginsWrapper.mount();

    const plugins = PluginsWrapper.getPlugins();
    expect(plugins.map((p) => ({ name: p.name, enabled: p.enabled })))
      .toMatchInlineSnapshot(`
      [
        {
          "enabled": false,
          "name": "first",
        },
        {
          "enabled": false,
          "name": "second",
        }
      ]
    `);
    // Should be in installedAt ascending order: 'first' then 'second'
    expect(plugins.map((p) => p.name)).toEqual(['first', 'second']);
  });

  it('(Hydration) ignores non-managed plugin locations', async () => {
    createPluginFolder(
      '/home/user/.local/share/com.nuclearplayer/plugins/managed/1.0.0',
      { id: 'managed', version: '1.0.0' },
    );
    await seedRegistryEntry({
      id: 'managed',
      enabled: false,
    });

    // Create plugin with bundled location (should be ignored)
    await seedRegistryEntry({
      id: 'bundled',
      location: 'bundled',
    });

    await hydratePluginsFromRegistry();
    await PluginsWrapper.mount();

    const plugins = PluginsWrapper.getPlugins();
    expect(plugins).toHaveLength(1);
    expect(plugins[0].name).toBe('managed');
  });

  it.todo(
    '(Hydration) logs and persists warnings for failed plugin load but keeps the registry entry',
  );

  it.todo(
    '(Hydration) runs in background: UI renders before hydration completes and updates when done',
  );

  it.todo(
    '(Hydration) exposes status flags and timings (total duration and per-plugin durations)',
  );

  it.todo(
    '(Hydration) toggling enable/disable persists to registry and is respected on next startup',
  );
});
