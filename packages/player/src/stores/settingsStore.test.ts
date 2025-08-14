import '../test/setup';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SettingDefinition } from '@nuclearplayer/plugin-sdk';

import { resetInMemoryTauriStore } from '../test/utils/inMemoryTauriStore';
import {
  createCoreSettingsHost,
  createPluginSettingsHost,
  getSetting,
  initializeSettingsStore,
  registerCoreSettings,
  setSetting,
  useSettingsStore,
} from './settingsStore';

vi.mock('@tauri-apps/plugin-store', async () => {
  const mod = await import('../test/utils/inMemoryTauriStore');
  return { LazyStore: mod.LazyStore };
});

describe('useSettingsStore', () => {
  beforeEach(() => {
    resetInMemoryTauriStore();
    useSettingsStore.setState({ definitions: {}, values: {}, loaded: false });
  });

  describe('initial state', () => {
    it('starts with empty definitions and values, not loaded', async () => {
      const state = useSettingsStore.getState();
      expect(state.definitions).toEqual({});
      expect(state.values).toEqual({});
      expect(state.loaded).toBe(false);
    });
  });

  describe('core settings', () => {
    it('registerCoreSettings registers definitions and exposes defaults', async () => {
      const defs: SettingDefinition[] = [
        {
          id: 'general.language',
          title: 'Language',
          category: 'general',
          kind: 'string',
          default: 'en',
        },
      ];
      const registered = registerCoreSettings(defs);
      expect(registered).toContain('core.general.language');
      const value = useSettingsStore
        .getState()
        .getValue('core.general.language');
      expect(value).toBe('en');
    });

    it('createCoreSettingsHost get/set persists values via store', async () => {
      const host = createCoreSettingsHost();
      await host.set('general.language', 'fr');
      const stored = getSetting('core.general.language');
      expect(stored).toBe('fr');
      const readBack = await host.get<string>('general.language');
      expect(readBack).toBe('fr');
    });

    it('subscribe notifies listeners on value changes', async () => {
      const host = createCoreSettingsHost();
      const seen: Array<string | undefined> = [];
      const unsubscribe = host.subscribe<string>(
        'general.language',
        (value) => {
          seen.push(value);
        },
      );
      await host.set('general.language', 'fr');
      unsubscribe();
      expect(seen[0]).toBe('fr');
    });
  });

  describe('plugin settings', () => {
    it('createPluginSettingsHost prefixes ids and isolates per plugin', async () => {
      const hostA = createPluginSettingsHost('p1', 'Plugin One');
      const hostB = createPluginSettingsHost('p2', 'Plugin Two');

      await hostA.register(
        [
          {
            id: 'feature.enabled',
            title: 'Enabled',
            category: 'Example',
            kind: 'boolean',
            default: false,
          },
        ],
        { type: 'plugin', pluginId: 'p1' },
      );

      await hostB.register(
        [
          {
            id: 'feature.enabled',
            title: 'Enabled',
            category: 'Example',
            kind: 'boolean',
            default: true,
          },
        ],
        { type: 'plugin', pluginId: 'p2' },
      );

      expect(
        useSettingsStore.getState().definitions['plugin.p1.feature.enabled'],
      ).toBeTruthy();
      expect(
        useSettingsStore.getState().definitions['plugin.p2.feature.enabled'],
      ).toBeTruthy();

      await hostA.set('feature.enabled', true);
      const aValue = useSettingsStore
        .getState()
        .getValue('plugin.p1.feature.enabled');
      const bValue = useSettingsStore
        .getState()
        .getValue('plugin.p2.feature.enabled');
      expect(aValue).toBe(true);
      expect(await hostA.get<string>('feature.enabled')).toBe(true);
      expect(bValue).toBe(true);
      expect(await hostB.get<string>('feature.enabled')).toBe(true);

      await hostB.set('feature.enabled', false);
      const aValue2 = useSettingsStore
        .getState()
        .getValue('plugin.p1.feature.enabled');
      const bValue2 = useSettingsStore
        .getState()
        .getValue('plugin.p2.feature.enabled');
      expect(aValue2).toBe(true);
      expect(await hostA.get<string>('feature.enabled')).toBe(true);
      expect(bValue2).toBe(false);
      expect(await hostB.get<string>('feature.enabled')).toBe(false);
    });
  });

  describe('persistence', () => {
    it('initializeSettingsStore loads values from disk using Tauri store', async () => {
      await setSetting('core.general.language', 'fr');
      useSettingsStore.setState({ definitions: {}, values: {}, loaded: false });
      await initializeSettingsStore();
      const loaded = getSetting('core.general.language');
      expect(loaded).toBe('fr');
    });
  });
});
