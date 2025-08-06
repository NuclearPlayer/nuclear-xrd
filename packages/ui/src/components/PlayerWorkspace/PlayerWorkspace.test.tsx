import { render } from '@testing-library/react';

import { PlayerWorkspace } from './PlayerWorkspace';

describe('PlayerWorkspace', () => {
  it('(Snapshot) both sidebars expanded', () => {
    const { asFragment } = render(
      <PlayerWorkspace>
        <PlayerWorkspace.LeftSidebar
          width={200}
          isCollapsed={false}
          onWidthChange={() => {}}
          onToggle={() => {}}
        />
        <PlayerWorkspace.Main />
        <PlayerWorkspace.RightSidebar
          width={200}
          isCollapsed={false}
          onWidthChange={() => {}}
          onToggle={() => {}}
        />
      </PlayerWorkspace>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) both sidebars collapsed', () => {
    const { asFragment } = render(
      <PlayerWorkspace>
        <PlayerWorkspace.LeftSidebar
          width={200}
          isCollapsed={true}
          onWidthChange={() => {}}
          onToggle={() => {}}
        />
        <PlayerWorkspace.Main />
        <PlayerWorkspace.RightSidebar
          width={200}
          isCollapsed={true}
          onWidthChange={() => {}}
          onToggle={() => {}}
        />
      </PlayerWorkspace>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
