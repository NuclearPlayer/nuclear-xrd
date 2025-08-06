import { render } from '@testing-library/react';

import { BottomBar } from './BottomBar';
import { PlayerShell } from './Layout';
import { PlayerWorkspace } from './PlayerWorkspace';
import { TopBar } from './TopBar';

describe('PlayerShell', () => {
  it('matches snapshot with complete layout', () => {
    const { asFragment } = render(
      <PlayerShell>
        <TopBar />
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
        </PlayerWorkspace>
        <BottomBar />
      </PlayerShell>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
