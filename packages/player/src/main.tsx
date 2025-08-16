import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { registerBuiltInCoreSettings } from './services/coreSettings';
import { initializeSettingsStore } from './stores/settingsStore';
import { initializeThemeStore } from './stores/themeStore';

import '@nuclearplayer/tailwind-config';

initializeSettingsStore()
  .then(() => registerBuiltInCoreSettings())
  .then(() => initializeThemeStore())
  .finally(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
