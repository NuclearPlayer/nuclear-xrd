import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { useLayoutStore } from './stores/layoutStore';

export const AppWrapper = {
  async collapseLeftSidebar() {
    const user = userEvent.setup();
    const leftToggle = screen
      .getAllByRole('button')
      .find(
        (btn) => btn.textContent === '‹' && btn.className.includes('right-1'),
      );
    if (leftToggle) {
      await user.click(leftToggle);
    }
  },

  async expandLeftSidebar() {
    const user = userEvent.setup();
    const leftExpand = screen
      .getAllByRole('button')
      .find(
        (btn) => btn.textContent === '›' && btn.className.includes('right-1'),
      );
    if (leftExpand) {
      await user.click(leftExpand);
    }
  },

  async collapseRightSidebar() {
    const user = userEvent.setup();
    const rightToggle = screen
      .getAllByRole('button')
      .find(
        (btn) => btn.textContent === '›' && btn.className.includes('left-1'),
      );
    if (rightToggle) {
      await user.click(rightToggle);
    }
  },

  async expandRightSidebar() {
    const user = userEvent.setup();
    const rightExpand = screen
      .getAllByRole('button')
      .find(
        (btn) => btn.textContent === '‹' && btn.className.includes('left-1'),
      );
    if (rightExpand) {
      await user.click(rightExpand);
    }
  },

  getLayoutState() {
    return useLayoutStore.getState();
  },

  resetState() {
    useLayoutStore.setState({
      leftSidebar: { isCollapsed: false, width: 200 },
      rightSidebar: { isCollapsed: false, width: 200 },
    });
  },
};
