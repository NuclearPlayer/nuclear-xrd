import { createRootRoute, Link } from '@tanstack/react-router';
import {
  BlocksIcon,
  CompassIcon,
  DiscIcon,
  GaugeIcon,
  LibraryIcon,
  ListMusicIcon,
  MusicIcon,
  PaletteIcon,
  ScrollTextIcon,
  Settings2Icon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

import { useTranslation } from '@nuclearplayer/i18n';
import {
  PlayerShell,
  PlayerWorkspace,
  RouteTransition,
  SidebarNavigation,
  SidebarNavigationCollapsible,
  SidebarNavigationItem,
  Toaster,
} from '@nuclearplayer/ui';

import { ConnectedPlayerBar } from '../components/ConnectedPlayerBar';
import {
  ConnectedQueuePanel,
  QueueHeaderActions,
} from '../components/ConnectedQueuePanel';
import { ConnectedTopBar } from '../components/ConnectedTopBar';
import { DevTools } from '../components/DevTools';
import { FlatpakWarningBanner } from '../components/FlatpakWarningBanner';
import { SoundProvider } from '../components/SoundProvider';
import { useLayoutStore } from '../stores/layoutStore';

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
      <div>
        <FlatpakWarningBanner />
        <ConnectedTopBar />
      </div>
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
                <Link to="/logs">
                  <SidebarNavigationItem>
                    <ScrollTextIcon />
                    {t('logs')}
                  </SidebarNavigationItem>
                </Link>
              </SidebarNavigationCollapsible>
              <SidebarNavigationCollapsible
                title={t('collection')}
                icon={<LibraryIcon />}
              >
                <Link to="/favorites/albums">
                  <SidebarNavigationItem>
                    <DiscIcon />
                    {t('favoriteAlbums')}
                  </SidebarNavigationItem>
                </Link>
                <Link to="/favorites/tracks">
                  <SidebarNavigationItem>
                    <MusicIcon />
                    {t('favoriteTracks')}
                  </SidebarNavigationItem>
                </Link>
                <Link to="/favorites/artists">
                  <SidebarNavigationItem>
                    <UserIcon />
                    {t('favoriteArtists')}
                  </SidebarNavigationItem>
                </Link>
                <Link to="/playlists">
                  <SidebarNavigationItem>
                    <ListMusicIcon />
                    {t('playlists')}
                  </SidebarNavigationItem>
                </Link>
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
            headerActions={<QueueHeaderActions />}
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
