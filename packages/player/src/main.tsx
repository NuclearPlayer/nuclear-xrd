import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { registerBuiltInCoreSettings } from './services/coreSettings';
import { initializeSettingsStore } from './stores/settingsStore';

import '@nuclearplayer/tailwind-config';
import '@nuclearplayer/themes';

import { applyThemeFromSettings } from './services/themeBootstrap';

initializeSettingsStore()
  .then(() => registerBuiltInCoreSettings())
  .then(() => applyThemeFromSettings());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
