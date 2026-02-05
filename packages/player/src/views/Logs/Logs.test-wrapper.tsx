import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';

export const LogsWrapper = {
  async mount(): Promise<RenderResult> {
    const component = render(<App />);
    await userEvent.click(
      await component.findByRole('button', { name: 'Preferences' }),
    );
    await userEvent.click(
      await component.findByRole('link', {
        name: 'Logs',
      }),
    );
    return component;
  },

  getSearchInput() {
    return screen.getByRole('textbox', { name: /search logs/i });
  },

  async clickExportButton() {
    await userEvent.click(screen.getByRole('button', { name: /export/i }));
  },
};
