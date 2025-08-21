import type { SettingDefinition } from '@nuclearplayer/plugin-sdk';

import { registerCoreSettings } from '../stores/settingsStore';

const LANGUAGE_OPTIONS = [
  { value: 'en_US', label: 'English' },
  { value: 'fr_FR', label: 'Français' },
];

export const CORE_SETTINGS: SettingDefinition[] = [
  {
    id: 'theme.id',
    title: 'settings.theme.id.title',
    description: 'settings.theme.id.description',
    category: 'appearance',
    kind: 'string',
    default: '',
    hidden: true,
    widget: { type: 'text' },
  },
  {
    id: 'theme.mode',
    title: 'settings.theme.mode.title',
    description: 'settings.theme.mode.description',
    category: 'appearance',
    kind: 'enum',
    options: [
      { value: 'basic', label: 'Basic' },
      { value: 'advanced', label: 'Advanced' },
    ],
    default: 'basic',
    hidden: true,
    widget: { type: 'select' },
  },
  {
    id: 'theme.advanced.path',
    title: 'settings.theme.advanced.path.title',
    description: 'settings.theme.advanced.path.description',
    category: 'appearance',
    kind: 'string',
    default: '',
    hidden: true,
    widget: { type: 'text' },
    format: 'path',
  },
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
    id: 'playback.muted',
    title: 'settings.playback.muted.title',
    description: 'settings.playback.muted.description',
    category: 'playback',
    kind: 'boolean',
    default: false,
    hidden: true,
    widget: { type: 'toggle' },
  },
  {
    id: 'playback.shuffle',
    title: 'settings.playback.shuffle.title',
    description: 'settings.playback.shuffle.description',
    category: 'playback',
    kind: 'boolean',
    default: false,
    hidden: true,
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
    id: 'playback.crossfadeMs',
    title: 'settings.playback.crossfadeMs.title',
    description: 'settings.playback.crossfadeMs.description',
    category: 'playback',
    kind: 'number',
    default: 0,
    widget: { type: 'number-input', min: 0, max: 5000, step: 50, unit: 'ms' },
  },
  {
    id: 'layout.leftSidebarWidth',
    title: 'settings.layout.leftSidebarWidth.title',
    description: 'settings.layout.leftSidebarWidth.description',
    category: 'layout',
    kind: 'number',
    default: 200,
    hidden: true,
    widget: { type: 'slider', min: 120, max: 480, step: 4, unit: 'px' },
  },
  {
    id: 'layout.rightSidebarWidth',
    title: 'settings.layout.rightSidebarWidth.title',
    description: 'settings.layout.rightSidebarWidth.description',
    category: 'layout',
    kind: 'number',
    default: 200,
    hidden: true,
    widget: { type: 'slider', min: 120, max: 480, step: 4, unit: 'px' },
  },
  {
    id: 'general.language',
    title: 'settings.general.language.title',
    description: 'settings.general.language.description',
    category: 'general',
    kind: 'enum',
    options: LANGUAGE_OPTIONS,
    default: 'en_US',
    widget: { type: 'select' },
  },
];

export const registerBuiltInCoreSettings = () => {
  registerCoreSettings(CORE_SETTINGS);
};
