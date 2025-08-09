import {
  BlocksIcon,
  CompassIcon,
  DiscIcon,
  GaugeIcon,
  LibraryIcon,
  MusicIcon,
  Settings2Icon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

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
            <SidebarNavigationCollapsible
              title="Explore"
              icon={<CompassIcon />}
            >
              <SidebarNavigationItem>
                <GaugeIcon />
                Dashboard
              </SidebarNavigationItem>
            </SidebarNavigationCollapsible>
            <SidebarNavigationCollapsible
              title="Preferences"
              icon={<SettingsIcon />}
            >
              <SidebarNavigationItem>
                <Settings2Icon />
                Settings
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <BlocksIcon />
                Plugins
              </SidebarNavigationItem>
            </SidebarNavigationCollapsible>
            <SidebarNavigationCollapsible
              title="Collection"
              icon={<LibraryIcon />}
            >
              <SidebarNavigationItem>
                <DiscIcon />
                Favorite albums
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <MusicIcon />
                Favorite tracks
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <UserIcon />
                Favorite artists
              </SidebarNavigationItem>
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
