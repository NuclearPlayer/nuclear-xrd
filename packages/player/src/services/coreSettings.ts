import type { SettingDefinition } from '@nuclearplayer/plugin-sdk';

import { registerCoreSettings } from '../stores/settingsStore';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
];

export const CORE_SETTINGS: SettingDefinition[] = [
  {
    id: 'playback.volume',
    title: 'settings.playback.volume.title',
    description: 'settings.playback.volume.description',
    category: 'playback',
    kind: 'number',
    default: 1,
    hidden: true,
    widget: { type: 'slider', min: 0, max: 1, step: 0.01 },
  },
  {
    id: 'playback.shuffle',
    title: 'settings.playback.shuffle.title',
    description: 'settings.playback.shuffle.description',
    category: 'playback',
    kind: 'boolean',
    default: false,
    widget: { type: 'toggle' },
  },
  {
    id: 'playback.skipSeconds',
    title: 'settings.playback.skipSeconds.title',
    description: 'settings.playback.skipSeconds.description',
    category: 'playback',
    kind: 'number',
    default: 10,
    widget: { type: 'number-input', min: 1, max: 60, step: 1, unit: 's' },
  },
  {
    id: 'layout.leftSidebarWidth',
    title: 'settings.layout.leftSidebarWidth.title',
    description: 'settings.layout.leftSidebarWidth.description',
    category: 'layout',
    kind: 'number',
    default: 200,
    widget: { type: 'slider', min: 120, max: 480, step: 4, unit: 'px' },
  },
  {
    id: 'layout.rightSidebarWidth',
    title: 'settings.layout.rightSidebarWidth.title',
    description: 'settings.layout.rightSidebarWidth.description',
    category: 'layout',
    kind: 'number',
    default: 200,
    widget: { type: 'slider', min: 120, max: 480, step: 4, unit: 'px' },
  },
  {
    id: 'general.language',
    title: 'settings.general.language.title',
    description: 'settings.general.language.description',
    category: 'general',
    kind: 'enum',
    options: LANGUAGE_OPTIONS,
    default: 'en',
    widget: { type: 'select' },
  },
];

export const registerBuiltInCoreSettings = () => {
  registerCoreSettings(CORE_SETTINGS);
};
