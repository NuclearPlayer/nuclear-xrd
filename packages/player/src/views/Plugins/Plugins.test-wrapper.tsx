import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';

export const PluginsWrapper = {
  async mount(): Promise<RenderResult> {
    const component = render(<App />);
    await userEvent.click(
      await component.findByRole('button', { name: 'Preferences' }),
    );
    await userEvent.click(
      await component.findByRole('link', {
        name: 'Plugins',
      }),
    );
    await screen.findByRole('heading', { name: 'Plugins' });

    return component;
  },
  getPlugins: () => {
    return screen
      .getAllByTestId('plugin-item')
      .map((item) => new PluginItemWrapper(item));
  },
};

class PluginItemWrapper {
  constructor(private element: HTMLElement) {}

  get name() {
    return within(this.element).getByTestId('plugin-name').textContent;
  }

  get author() {
    return within(this.element).getByTestId('plugin-author').textContent;
  }

  get description() {
    return within(this.element).getByTestId('plugin-description').textContent;
  }

  get enabled() {
    return (
      within(this.element)
        .getByTestId('toggle-enable-plugin')
        .getAttribute('data-enabled') === 'true'
    );
  }

  toggle = async () => {
    await userEvent.click(
      within(this.element).getByTestId('toggle-enable-plugin'),
    );
  };
}
