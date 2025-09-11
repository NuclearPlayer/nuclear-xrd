import { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchWrapper } from '../Search/Search.test-wrapper';

export const ArtistWrapper = {
  async mount(): Promise<RenderResult> {
    const component = await SearchWrapper.mount('test artist');
    await userEvent.click(component.getByText('Artists'));
    await userEvent.click(component.getByText('Test Artist'));

    return component;
  },
};
