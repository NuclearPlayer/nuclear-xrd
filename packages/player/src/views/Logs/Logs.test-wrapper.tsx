import { render, RenderResult } from '@testing-library/react';
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
};
