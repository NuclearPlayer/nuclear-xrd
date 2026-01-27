import { screen } from '@testing-library/react';

import { FetchMock } from '../../test/mocks/fetch';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { PluginsWrapper } from './Plugins.test-wrapper';
import { fakeMarketplacePlugins } from './Plugins.test.data';

describe('Plugin Store', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    FetchMock.reset();
  });

  it('(Snapshot) renders the plugin store with plugins from the registry', async () => {
    FetchMock.get('plugin-registry', {
      version: 1,
      plugins: fakeMarketplacePlugins,
    });

    const component = (await PluginsWrapper.mount()).getByTestId(
      'player-workspace-main',
    );
    await PluginsWrapper.goToStoreTab();

    await screen.findAllByTestId('plugin-store-item');

    expect(component).toMatchSnapshot();
  });
});
