import './test/mocks/plugin-fs';

import { hydratePluginsFromRegistry } from './services/plugins/pluginBootstrap';
import { upsertRegistryEntry } from './services/plugins/pluginRegistry';
import { resetInMemoryTauriStore } from './test/utils/inMemoryTauriStore';
import { createPluginFolder } from './test/utils/testPluginFolder';
import { PluginsWrapper } from './views/Plugins/Plugins.test-wrapper';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('./test/utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

describe('App plugin hydration', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
  });

  it('(Hydration) loads a disabled plugin from registry and shows it disabled', async () => {
    // Start with a plugin installed in the managed dir
    createPluginFolder(
      '/home/user/local/share/com.nuclearplayer/plugins/plain/1.0.0',
      { id: 'plain', version: '1.0.0' },
    );

    await upsertRegistryEntry({
      id: 'plain',
      version: '1.0.0',
      path: '/home/user/.local/share/com.nuclearplayer/plugins/plain/1.0.0',
      location: 'user',
      enabled: false,
      installedAt: '2025-01-01T00:00:00.000Z',
      lastUpdatedAt: '2025-01-01T00:00:00.000Z',
      warnings: [],
    });

    await hydratePluginsFromRegistry();
    await PluginsWrapper.mount();

    const plugins = PluginsWrapper.getPlugins();
    expect(plugins).toHaveLength(1);
    expect(plugins[0].enabled).toBe(false);
  });

  it.todo('(Hydration) loads an enabled plugin from registry and enables it');

  it.todo('(Hydration) loads multiple plugins in installedAt ascending order');

  it.todo('(Hydration) ignores non-managed plugin locations');

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
