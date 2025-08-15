import '../../test/setup';

import { vi } from 'vitest';

import { registerBuiltInCoreSettings } from '../../services/coreSettings';
import { resetInMemoryTauriStore } from '../../test/utils/inMemoryTauriStore';
import { SettingsWrapper } from './Settings.test-wrapper';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('../../test/utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

window.scrollTo = vi.fn();

describe('Settings view', async () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    registerBuiltInCoreSettings();
  });
  it('(Snapshot) renders the settings view', async () => {
    const { asFragment } = await SettingsWrapper.mount();
    expect(asFragment()).toMatchSnapshot();
  });
});
