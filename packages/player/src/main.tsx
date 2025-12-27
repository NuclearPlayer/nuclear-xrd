import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { registerBuiltInCoreSettings } from './services/coreSettings';
import { initializeQueueStore } from './stores/queueStore';
import { initializeSettingsStore } from './stores/settingsStore';

import '@nuclearplayer/tailwind-config';
import '@nuclearplayer/themes';
import '@nuclearplayer/i18n';

import { startAdvancedThemeWatcher } from './services/advancedThemeDirService';
import { applyAdvancedThemeFromSettingsIfAny } from './services/advancedThemeService';
import {
  applyLanguageFromSettings,
  initLanguageWatcher,
} from './services/languageService';
import { hydratePluginsFromRegistry } from './services/plugins/pluginBootstrap';
import { applyThemeFromSettings } from './services/themeBootstrap';

initializeSettingsStore()
  .then(() => initializeQueueStore())
  .then(() => registerBuiltInCoreSettings())
  .then(() => applyLanguageFromSettings())
  .then(() => initLanguageWatcher())
  .then(() => startAdvancedThemeWatcher())
  .then(() => applyThemeFromSettings())
  .then(() => applyAdvancedThemeFromSettingsIfAny())
  .then(() => {
    // Run plugin hydration in the background
    void hydratePluginsFromRegistry();
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
