import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';

const user = userEvent.setup();

export const SearchWrapper = {
  async mount(query?: string): Promise<RenderResult> {
    const component = render(<App />);

    const searchBox = await component.findByTestId('search-box');
    await user.type(searchBox, query ?? 'test');
    await user.keyboard('{Enter}');
    await screen.findByTestId('search-view');

    return component;
  },
};
