import { render } from '@testing-library/react';

import App from './App';
import { AppWrapper } from './App.test-wrapper';

describe('App', () => {
  beforeEach(() => {
    AppWrapper.resetState();
  });

  it('should render snapshot', () => {
    const component = render(<App />);
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should handle sidebar collapse/expand user flow', async () => {
    render(<App />);

    expect(AppWrapper.getLayoutState().leftSidebar.isCollapsed).toBe(false);
    expect(AppWrapper.getLayoutState().rightSidebar.isCollapsed).toBe(false);

    await AppWrapper.toggleLeftSidebar();
    expect(AppWrapper.getLayoutState().leftSidebar.isCollapsed).toBe(true);
    expect(AppWrapper.getLayoutState().rightSidebar.isCollapsed).toBe(false);

    await AppWrapper.toggleRightSidebar();
    expect(AppWrapper.getLayoutState().leftSidebar.isCollapsed).toBe(true);
    expect(AppWrapper.getLayoutState().rightSidebar.isCollapsed).toBe(true);

    await AppWrapper.toggleLeftSidebar();
    expect(AppWrapper.getLayoutState().leftSidebar.isCollapsed).toBe(false);
    expect(AppWrapper.getLayoutState().rightSidebar.isCollapsed).toBe(true);

    await AppWrapper.toggleRightSidebar();
    expect(AppWrapper.getLayoutState().leftSidebar.isCollapsed).toBe(false);
    expect(AppWrapper.getLayoutState().rightSidebar.isCollapsed).toBe(false);

    await AppWrapper.toggleLeftSidebar();
    await AppWrapper.toggleLeftSidebar();
    expect(AppWrapper.getLayoutState().leftSidebar.isCollapsed).toBe(false);
  });
});
