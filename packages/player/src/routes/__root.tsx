import { createRootRoute, Link } from '@tanstack/react-router';
import {
  BlocksIcon,
  CompassIcon,
  DiscIcon,
  GaugeIcon,
  LibraryIcon,
  MusicIcon,
  PaletteIcon,
  Settings2Icon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

import {
  BottomBar,
  PlayerShell,
  PlayerWorkspace,
  RouteTransition,
  SidebarNavigation,
  SidebarNavigationCollapsible,
  SidebarNavigationItem,
  TopBar,
} from '@nuclearplayer/ui';

import { useLayoutStore } from '../stores/layoutStore';

const RootComponent = () => {
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
              <Link to="/dashboard">
                <SidebarNavigationItem>
                  <GaugeIcon />
                  Dashboard
                </SidebarNavigationItem>
              </Link>
            </SidebarNavigationCollapsible>
            <SidebarNavigationCollapsible
              title="Preferences"
              icon={<SettingsIcon />}
            >
              <Link to="/settings">
                <SidebarNavigationItem>
                  <Settings2Icon />
                  Settings
                </SidebarNavigationItem>
              </Link>
              <Link to="/plugins">
                <SidebarNavigationItem>
                  <BlocksIcon />
                  Plugins
                </SidebarNavigationItem>
              </Link>
              <Link to="/themes">
                <SidebarNavigationItem>
                  <PaletteIcon />
                  Themes
                </SidebarNavigationItem>
              </Link>
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

        <PlayerWorkspace.Main>
          <RouteTransition />
        </PlayerWorkspace.Main>

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
};

export const Route = createRootRoute({
  component: RootComponent,
});
