import * as fs from '@tauri-apps/plugin-fs';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock } from 'vitest';

import * as themes from '@nuclearplayer/themes';

import { useSettingsStore } from '../../stores/settingsStore';
import { ThemesWrapper } from './Themes.test-wrapper';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('../../test/utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

vi.mock('@tauri-apps/plugin-fs', () => ({
  readTextFile: vi.fn(),
}));

const advancedThemes = [
  { name: 'My Theme', path: '/themes/my.json' },
  { name: 'Another', path: '/themes/another.json' },
];

describe('Themes view', async () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(themes, 'setThemeId');
    vi.spyOn(themes, 'applyAdvancedTheme');
  });
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

  it('loads and applies selected advanced theme file', async () => {
    (fs.readTextFile as Mock).mockResolvedValue(
      JSON.stringify({
        version: 1,
        name: 'My Theme',
        vars: { primary: '#123' },
      }),
    );

    await ThemesWrapper.mount({ advancedThemes });

    await ThemesWrapper.selectAdvancedTheme('My Theme');

    expect(fs.readTextFile).toHaveBeenCalledWith('/themes/my.json');
    expect(themes.setThemeId).toHaveBeenCalledWith('');
    expect(themes.applyAdvancedTheme).toHaveBeenCalledTimes(1);
    expect(useSettingsStore.getState().getValue('core.theme.mode')).toBe(
      'advanced',
    );
    expect(
      useSettingsStore.getState().getValue('core.theme.advanced.path'),
    ).toBe('/themes/my.json');
  });

  it('reset to default from advanced themes select', async () => {
    (fs.readTextFile as Mock).mockResolvedValue(
      JSON.stringify({
        version: 1,
        name: 'My Theme',
        vars: { primary: '#123' },
      }),
    );

    await ThemesWrapper.mount({
      advancedThemes: [{ name: 'My Theme', path: '/themes/my.json' }],
    });

    await ThemesWrapper.selectAdvancedTheme('My Theme');
    await ThemesWrapper.selectDefaultTheme();

    expect(useSettingsStore.getState().getValue('core.theme.mode')).toBe(
      'basic',
    );
    expect(
      useSettingsStore.getState().getValue('core.theme.advanced.path'),
    ).toBe('');
  });
});
