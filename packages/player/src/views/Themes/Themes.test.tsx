import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSettingsStore } from '../../stores/settingsStore';
import { ThemesWrapper } from './Themes.test-wrapper';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('../../test/utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

describe('Themes view', async () => {
  it('(Snapshot) renders the themes view', async () => {
    const { asFragment } = await ThemesWrapper.mount();
    expect(asFragment()).toMatchSnapshot();
  });

  it('switches to basic themes', async () => {
    await ThemesWrapper.mount();
    await userEvent.click(await screen.findByText('Ember'));
    expect(useSettingsStore.getState().getValue('core.theme.id')).toBe(
      'nuclear:ember',
    );
  });
});
