import { mockIPC } from '@tauri-apps/api/mocks';

import { NuclearPluginBuilder } from '../test/builders/NuclearPluginBuilder';
import { PluginStateBuilder } from '../test/builders/PluginStateBuilder';
import { createPluginFolder } from '../test/utils/testPluginFolder';
import { usePluginStore } from './pluginStore';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('../test/utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

describe('usePluginStore', () => {
  beforeEach(() => {
    usePluginStore.setState({ plugins: {} });
    mockIPC((cmd) => {
      if (cmd === 'copy_dir_recursive') {
        return true;
      }
    });
  });

  describe('initial state', () => {
    it('starts empty', () => {
      expect(usePluginStore.getState().plugins).toEqual({});
    });
  });

  describe('getters', () => {
    it('getPlugin undefined when missing', () => {
      expect(usePluginStore.getState().getPlugin('x')).toBeUndefined();
    });
    it('getPlugin returns existing', () => {
      const plugin = new PluginStateBuilder().withId('p1').build();
      usePluginStore.setState({ plugins: { p1: plugin } });
      expect(usePluginStore.getState().getPlugin('p1')).toEqual(plugin);
    });
    it('getAllPlugins returns array', () => {
      const p1 = new PluginStateBuilder().withId('p1').build();
      const p2 = new PluginStateBuilder().withId('p2').build();
      usePluginStore.setState({ plugins: { p1, p2 } });
      expect(usePluginStore.getState().getAllPlugins()).toHaveLength(2);
    });
  });

  describe('loadPluginFromPath', () => {
    it('loads a plugin', async () => {
      createPluginFolder('/plugins/plain', {
        id: 'plain',
      });

      await usePluginStore.getState().loadPluginFromPath('/plugins/plain');
      const plugin = usePluginStore.getState().getPlugin('plain');
      expect(plugin?.enabled).toBe(false);
      expect(plugin?.warning).toBe(false);
      expect(plugin?.warnings).toEqual([]);
    });

    it('loads a plugin with warnings', async () => {
      createPluginFolder('/plugins/perm-plugin', {
        id: 'perm-plugin',
        permissions: ['alpha', 'beta'],
      });

      await usePluginStore
        .getState()
        .loadPluginFromPath('/plugins/perm-plugin');
      const plugin = usePluginStore.getState().getPlugin('perm-plugin');
      expect(plugin?.enabled).toBe(false);
      expect(plugin?.warning).toBe(true);
      expect(plugin?.warnings[0]).toMatch(/Unknown permissions: alpha, beta/);
    });

    it('skips inserting on load failure', async () => {
      await usePluginStore
        .getState()
        .loadPluginFromPath('/plugins/fail-plugin');
      const plugin = usePluginStore.getState().getPlugin('fail-plugin');
      expect(plugin).toBeUndefined();
    });

    it('does not insert duplicate id and does not throw', async () => {
      createPluginFolder('/plugins/plain', { id: 'plain' });
      await usePluginStore.getState().loadPluginFromPath('/plugins/plain');
      const sizeBefore = usePluginStore.getState().getAllPlugins().length;
      await usePluginStore.getState().loadPluginFromPath('/plugins/plain');
      const sizeAfter = usePluginStore.getState().getAllPlugins().length;
      expect(sizeAfter).toBe(sizeBefore);
    });
  });

  describe('enable/disable', () => {
    it('enables plugin and calls onEnable if present', async () => {
      const onEnable = vi.fn();
      const id = 'with-enable';
      usePluginStore.setState({
        plugins: {
          [id]: new PluginStateBuilder()
            .withId(id)
            .withInstance(
              new NuclearPluginBuilder().withOnEnable(onEnable).build(),
            )
            .build(),
        },
      });
      await usePluginStore.getState().enablePlugin(id);
      expect(onEnable).toHaveBeenCalled();
      expect(usePluginStore.getState().getPlugin(id)?.enabled).toBe(true);
    });

    it('disables plugin and calls onDisable if present', async () => {
      const onDisable = vi.fn();
      const id = 'with-disable';
      usePluginStore.setState({
        plugins: {
          [id]: new PluginStateBuilder()
            .withId(id)
            .withEnabled(true)
            .withInstance(
              new NuclearPluginBuilder().withOnDisable(onDisable).build(),
            )
            .build(),
        },
      });
      await usePluginStore.getState().disablePlugin(id);
      expect(onDisable).toHaveBeenCalled();
      expect(usePluginStore.getState().getPlugin(id)?.enabled).toBe(false);
    });

    it('enablePlugin throws if missing', async () => {
      await expect(
        usePluginStore.getState().enablePlugin('missing'),
      ).rejects.toThrow('Plugin missing not found');
    });

    it('disablePlugin throws if missing', async () => {
      await expect(
        usePluginStore.getState().disablePlugin('missing'),
      ).rejects.toThrow('Plugin missing not found');
    });

    it('enablePlugin throws when instance missing', async () => {
      usePluginStore.setState({
        plugins: { p1: new PluginStateBuilder().withId('p1').build() },
      });
      await expect(
        usePluginStore.getState().enablePlugin('p1'),
      ).rejects.toThrow('Plugin p1 has no instance');
    });

    it('disablePlugin throws when instance missing', async () => {
      usePluginStore.setState({
        plugins: {
          p1: new PluginStateBuilder().withId('p1').withEnabled(true).build(),
        },
      });
      await expect(
        usePluginStore.getState().disablePlugin('p1'),
      ).rejects.toThrow('Plugin p1 has no instance');
    });
  });

  describe('unloadPlugin', () => {
    it('unloads plugin (enabled -> disable -> unload)', async () => {
      const onDisable = vi.fn();
      const onUnload = vi.fn();
      const id = 'to-unload';
      usePluginStore.setState({
        plugins: {
          [id]: new PluginStateBuilder()
            .withId(id)
            .withEnabled(true)
            .withInstance(
              new NuclearPluginBuilder()
                .withOnDisable(onDisable)
                .withOnUnload(onUnload)
                .build(),
            )
            .build(),
        },
      });
      await usePluginStore.getState().unloadPlugin(id);
      expect(onDisable).toHaveBeenCalled();
      expect(onUnload).toHaveBeenCalled();
      expect(usePluginStore.getState().getPlugin(id)).toBeUndefined();
    });

    it('unloads plugin without onUnload', async () => {
      const id = 'simple-unload';
      usePluginStore.setState({
        plugins: {
          [id]: new PluginStateBuilder()
            .withId(id)
            .withInstance(new NuclearPluginBuilder().build())
            .build(),
        },
      });
      await usePluginStore.getState().unloadPlugin(id);
      expect(usePluginStore.getState().getPlugin(id)).toBeUndefined();
    });

    it('throws for missing plugin', async () => {
      await expect(
        usePluginStore.getState().unloadPlugin('missing'),
      ).rejects.toThrow('Plugin missing not found');
    });

    it('still removes plugin if errors during unload chain', async () => {
      const onDisable = vi.fn().mockRejectedValue(new Error('disable failed'));
      const id = 'error-unload';
      usePluginStore.setState({
        plugins: {
          [id]: new PluginStateBuilder()
            .withId(id)
            .withEnabled(true)
            .withInstance(
              new NuclearPluginBuilder().withOnDisable(onDisable).build(),
            )
            .build(),
        },
      });
      await expect(usePluginStore.getState().unloadPlugin(id)).rejects.toThrow(
        'disable failed',
      );
      expect(usePluginStore.getState().getPlugin(id)).toBeUndefined();
    });
  });
});
