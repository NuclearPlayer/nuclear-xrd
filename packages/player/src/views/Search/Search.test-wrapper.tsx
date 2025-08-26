import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';

export const SearchWrapper = {
  async mount(query?: string): Promise<RenderResult> {
    const component = render(<App />);

    const searchBox = await component.findByTestId('search-box');
    userEvent.type(searchBox, query ?? 'test');
    userEvent.type(searchBox, '{enter}');
    await screen.findByTestId('search-view');

    return component;
  },
};
