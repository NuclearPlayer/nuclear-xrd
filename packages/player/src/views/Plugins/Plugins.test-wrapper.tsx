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
  async goToStoreTab(): Promise<void> {
    await userEvent.click(screen.getByRole('tab', { name: 'Store' }));
  },
  getPlugins: () => {
    return screen
      .queryAllByTestId('plugin-item')
      .map((item) => new PluginItemWrapper(item));
  },
  getStorePlugins: () => {
    return screen
      .queryAllByTestId('plugin-store-item')
      .map((item) => new PluginStoreItemWrapper(item));
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
      within(this.element).getByRole('switch').getAttribute('data-enabled') ===
      'true'
    );
  }

  toggle = async () => {
    await userEvent.click(within(this.element).getByRole('switch'));
  };
}

class PluginStoreItemWrapper {
  constructor(private element: HTMLElement) {}

  get name() {
    return within(this.element).getByTestId('plugin-store-item-name')
      .textContent;
  }

  get author() {
    return within(this.element).getByTestId('plugin-store-item-author')
      .textContent;
  }

  get description() {
    return within(this.element).getByTestId('plugin-store-item-description')
      .textContent;
  }
}
