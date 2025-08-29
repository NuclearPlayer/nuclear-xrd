import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PluginDialogMock } from '../../test/mocks/plugin-dialog';
import { PluginFsMock } from '../../test/mocks/plugin-fs';
import { PluginsWrapper } from './Plugins.test-wrapper';
import { fakePluginManifest } from './Plugins.test.data';

describe('Plugins view', () => {
  it('(Snapshot) renders the plugins view', async () => {
    const { asFragment } = await PluginsWrapper.mount();
    expect(asFragment()).toMatchSnapshot();
  });

  it('adds a plugin and enables it', async () => {
    PluginDialogMock.setOpen('/path/to/plugin');

    const readTextFileMock = PluginFsMock.setReadTextFile(fakePluginManifest);

    await PluginsWrapper.mount();
    await userEvent.click(screen.getByText('Add Plugin'));

    // Manifest has been read
    expect(readTextFileMock).nthCalledWith(1, '/path/to/plugin/package.json');
    // Code has been read
    expect(readTextFileMock).nthCalledWith(2, '/path/to/plugin/index.ts');

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
