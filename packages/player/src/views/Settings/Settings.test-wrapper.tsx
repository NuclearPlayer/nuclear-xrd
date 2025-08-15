import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';
import { registerBuiltInCoreSettings } from '../../services/coreSettings';
import { initializeSettingsStore } from '../../stores/settingsStore';

export const SettingsWrapper = {
  async mount(): Promise<RenderResult> {
    await initializeSettingsStore();
    registerBuiltInCoreSettings();
    const component = render(<App />);
    await userEvent.click(
      await component.findByRole('button', { name: /preferences/i }),
    );
    await userEvent.click(
      await component.findByRole('link', {
        name: /settings/i,
      }),
    );
    await screen.findByRole('heading', { name: /settings/i });

    return component;
  },
};
