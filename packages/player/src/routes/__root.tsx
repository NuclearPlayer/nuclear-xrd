import { createRootRoute, Link, useRouter } from '@tanstack/react-router';
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
import { useState } from 'react';

import {
  PlayerBar,
  PlayerShell,
  PlayerWorkspace,
  RouteTransition,
  SidebarNavigation,
  SidebarNavigationCollapsible,
  SidebarNavigationItem,
  Toaster,
  TopBar,
} from '@nuclearplayer/ui';

import { DevTools } from '../components/DevTools';
import { SoundProvider } from '../components/SoundProvider';
import { useLayoutStore } from '../stores/layoutStore';

const cover = 'https://picsum.photos/64';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const submit = () => {
    const q = query.trim();
    if (q.length === 0) {
      return;
    }

    router.navigate({ to: '/search', search: { q } });
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submit();
          }
        }}
        placeholder="Search"
        className="bg-background border-border ml-4 w-80 rounded border-2 px-3 py-1 outline-none"
      />
    </div>
  );
};

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
      <TopBar>
        <SearchBar />
      </TopBar>

      <SoundProvider>
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
      </SoundProvider>

      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title="Song Title"
            artist="Artist Name"
            coverUrl={cover}
          />
        }
        center={<PlayerBar.Controls />}
        right={<PlayerBar.Volume defaultValue={75} />}
      />
      <Toaster />
      <DevTools />
    </PlayerShell>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
