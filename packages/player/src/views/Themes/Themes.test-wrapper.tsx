import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';

export const ThemesWrapper = {
  async mount(): Promise<RenderResult> {
    const component = render(<App />);
    await userEvent.click(
      await component.findByRole('button', { name: /preferences/i }),
    );
    await userEvent.click(
      await component.findByRole('link', {
        name: /themes/i,
      }),
    );
    return component;
  },
};
