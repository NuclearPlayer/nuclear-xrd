import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';

import App from '../../App';
import { routeTree } from '../../routeTree.gen';
import { providersServiceHost } from '../../services/providersService';
import { SearchWrapper } from './Search.test-wrapper';

describe('Search view', () => {
  beforeEach(() => {
    providersServiceHost.clear();
  });

  it('(Snapshot) renders the search view', async () => {
    const { asFragment } = await SearchWrapper.mount();
    expect(asFragment()).toMatchSnapshot();
  });

  it('executes search when navigating via url search query', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/search?q=hello'],
    });
    const router = createRouter({ routeTree, history });

    render(<App routerProp={router} />);

    expect(await screen.findByTestId('search-view')).toBeVisible();
    expect(await screen.findByText('Query: "hello"')).toBeVisible();
  });
});
