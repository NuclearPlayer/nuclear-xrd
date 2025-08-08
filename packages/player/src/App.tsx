import {
  BottomBar,
  PlayerShell,
  PlayerWorkspace,
  SidebarNavigation,
  SidebarNavigationCollapsible,
  SidebarNavigationItem,
  TopBar,
} from '@nuclearplayer/ui';

import { useLayoutStore } from './stores/layoutStore';

function App() {
  const {
    leftSidebar,
    rightSidebar,
    toggleLeftSidebar,
    toggleRightSidebar,
    setLeftSidebarWidth,
    setRightSidebarWidth,
  } = useLayoutStore();

  return (
    <PlayerShell>
      <TopBar />

      <PlayerWorkspace>
        <PlayerWorkspace.LeftSidebar
          width={leftSidebar.width}
          isCollapsed={leftSidebar.isCollapsed}
          onWidthChange={setLeftSidebarWidth}
          onToggle={toggleLeftSidebar}
        >
          <SidebarNavigation>
            <SidebarNavigationCollapsible title="Navigation">
              <SidebarNavigationItem>Test</SidebarNavigationItem>
              <SidebarNavigationItem>Test2</SidebarNavigationItem>
            </SidebarNavigationCollapsible>
            <SidebarNavigationCollapsible title="Your library">
              <SidebarNavigationItem>Favorite albums</SidebarNavigationItem>
              <SidebarNavigationItem>Favorite tracks</SidebarNavigationItem>
            </SidebarNavigationCollapsible>
          </SidebarNavigation>
        </PlayerWorkspace.LeftSidebar>

        <PlayerWorkspace.Main />

        <PlayerWorkspace.RightSidebar
          width={rightSidebar.width}
          isCollapsed={rightSidebar.isCollapsed}
          onWidthChange={setRightSidebarWidth}
          onToggle={toggleRightSidebar}
        />
      </PlayerWorkspace>

      <BottomBar />
    </PlayerShell>
  );
}

export default App;
