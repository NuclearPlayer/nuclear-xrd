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

import { useTranslation } from '@nuclearplayer/i18n';
import {
  PlayerShell,
  PlayerWorkspace,
  RouteTransition,
  SidebarNavigation,
  SidebarNavigationCollapsible,
  SidebarNavigationItem,
  Toaster,
  TopBar,
} from '@nuclearplayer/ui';

import { ConnectedPlayerBar } from '../components/ConnectedPlayerBar';
import { ConnectedQueuePanel } from '../components/ConnectedQueuePanel';
import { DevTools } from '../components/DevTools';
import { SoundProvider } from '../components/SoundProvider';
import { useLayoutStore } from '../stores/layoutStore';

const SearchBox = () => {
  const { t } = useTranslation('search');
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
        data-testid="search-box"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submit();
          }
        }}
        placeholder={t('placeholder')}
        className="bg-background border-border ml-4 w-80 rounded-md border-2 px-3 py-1 outline-none"
      />
    </div>
  );
};
const RootComponent = () => {
  const { t } = useTranslation('navigation');
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
        <SearchBox />
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
                title={t('explore')}
                icon={<CompassIcon />}
              >
                <Link to="/dashboard">
                  <SidebarNavigationItem>
                    <GaugeIcon />
                    {t('dashboard')}
                  </SidebarNavigationItem>
                </Link>
              </SidebarNavigationCollapsible>
              <SidebarNavigationCollapsible
                title={t('preferences')}
                icon={<SettingsIcon />}
              >
                <Link to="/settings">
                  <SidebarNavigationItem>
                    <Settings2Icon />
                    {t('settings')}
                  </SidebarNavigationItem>
                </Link>
                <Link to="/plugins">
                  <SidebarNavigationItem>
                    <BlocksIcon />
                    {t('plugins')}
                  </SidebarNavigationItem>
                </Link>
                <Link to="/themes">
                  <SidebarNavigationItem>
                    <PaletteIcon />
                    {t('themes')}
                  </SidebarNavigationItem>
                </Link>
              </SidebarNavigationCollapsible>
              <SidebarNavigationCollapsible
                title={t('collection')}
                icon={<LibraryIcon />}
              >
                <SidebarNavigationItem>
                  <DiscIcon />
                  {t('favoriteAlbums')}
                </SidebarNavigationItem>
                <SidebarNavigationItem>
                  <MusicIcon />
                  {t('favoriteTracks')}
                </SidebarNavigationItem>
                <SidebarNavigationItem>
                  <UserIcon />
                  {t('favoriteArtists')}
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
          >
            <ConnectedQueuePanel isCollapsed={rightSidebar.isCollapsed} />
          </PlayerWorkspace.RightSidebar>
        </PlayerWorkspace>
      </SoundProvider>

      <ConnectedPlayerBar />
      <Toaster />
      <DevTools />
    </PlayerShell>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
