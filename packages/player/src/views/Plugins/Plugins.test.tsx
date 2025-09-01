import { mockIPC } from '@tauri-apps/api/mocks';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PluginDialogMock } from '../../test/mocks/plugin-dialog';
import { PluginFsMock } from '../../test/mocks/plugin-fs';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { PluginsWrapper } from './Plugins.test-wrapper';
import { fakePluginManifest } from './Plugins.test.data';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('../../test/utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

describe('Plugins view', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
  });
  it('(Snapshot) renders the plugins view', async () => {
    const { asFragment } = await PluginsWrapper.mount();
    expect(asFragment()).toMatchSnapshot();
  });

  it('adds a plugin and enables it', async () => {
    PluginDialogMock.setOpen('/path/to/plugin');

    const readTextFileMock = PluginFsMock.setReadTextFile(fakePluginManifest);
    PluginFsMock.setExistsFor(
      'plugins',
      '/home/user/.local/share/com.nuclearplayer',
      true,
    );

    mockIPC((cmd) => {
      if (cmd === 'copy_dir_recursive') {
        return true;
      }
    });

    await PluginsWrapper.mount();
    await userEvent.click(screen.getByText('Add Plugin'));

    // Manifest has been read
    expect(readTextFileMock).nthCalledWith(1, '/path/to/plugin/package.json');

    // After copying the plugin to managed folder, its manifest has been read
    expect(readTextFileMock).nthCalledWith(
      2,
      '/home/user/.local/share/com.nuclearplayer/plugins/nuclear-fake-plugin/0.1.0/package.json',
    );

    // Code has been read (in the managed location)
    expect(readTextFileMock).nthCalledWith(
      3,
      '/home/user/.local/share/com.nuclearplayer/plugins/nuclear-fake-plugin/0.1.0/index.ts',
    );

    expect(
      PluginsWrapper.getPlugins().map((plugin) => ({
        name: plugin.name,
        description: plugin.description,
        author: plugin.author,
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "author": "by nukeop",
          "description": "Fake plugin for testing",
          "name": "Fake plugin",
        },
      ]
    `);

    expect(PluginsWrapper.getPlugins()[0].enabled).toBe(false);
    await PluginsWrapper.getPlugins()[0].toggle();
    expect(PluginsWrapper.getPlugins()[0].enabled).toBe(true);
  });
});
