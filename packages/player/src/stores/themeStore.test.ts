import '../test/setup';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import { joinPath, writeFile } from '../test/utils/testPluginFolder';
import { initializeThemeStore, useThemeStore } from './themeStore';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('../test/utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

describe('Theme store', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    document.documentElement.removeAttribute('style');
    const existing = document.getElementById('theme-dark-overrides');
    if (existing) existing.remove();
  });

  it('(Snapshot) applies defaults from settings', async () => {
    await initializeThemeStore();
    const light = (
      document.getElementById('theme-light-variables')?.textContent ?? ''
    ).trim();
    const dark = (
      document.getElementById('theme-dark-overrides')?.textContent ?? ''
    ).trim();
    expect({ light, dark }).toMatchSnapshot();
  });

  it('updates on primary change and keeps a single dark style node', async () => {
    await initializeThemeStore();
    const beforeCount = document.querySelectorAll(
      '#theme-dark-overrides',
    ).length;
    expect(beforeCount).toBe(1);
    await useThemeStore.getState().setPrimary('oklch(60% 0.2 210)');
    const afterCount = document.querySelectorAll(
      '#theme-dark-overrides',
    ).length;
    expect(afterCount).toBe(1);
    const light = (
      document.getElementById('theme-light-variables')?.textContent ?? ''
    ).trim();
    expect(light).toContain('oklch(60% 0.2 210)');
  });

  it('(Snapshot) applies advanced theme from JSON file', async () => {
    const themePath = await joinPath('/themes', 'test-theme.json');
    const themeJson = JSON.stringify({
      version: 1,
      name: 'Test Theme',
      variables: {
        background: 'oklch(95% 0.02 120)',
        primary: 'oklch(70% 0.18 160)',
      },
      dark: {
        background: 'oklch(40% 0.08 120)',
      },
    });
    writeFile(themePath, themeJson);
    await initializeThemeStore();
    await useThemeStore.getState().setTier('advanced');
    await useThemeStore.getState().setActiveThemePath(themePath);
    const light = document.documentElement.getAttribute('style') ?? '';
    const dark = (
      document.getElementById('theme-dark-overrides')?.textContent ?? ''
    ).trim();
    expect({ light, dark }).toMatchSnapshot();
  });
});
