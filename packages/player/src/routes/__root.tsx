import { createRootRoute } from '@tanstack/react-router';
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
                <SidebarNavigationItem to="/dashboard">
                  <GaugeIcon />
                  {t('dashboard')}
                </SidebarNavigationItem>
              </SidebarNavigationCollapsible>
              <SidebarNavigationCollapsible
                title={t('preferences')}
                icon={<SettingsIcon />}
              >
                <SidebarNavigationItem to="/settings">
                  <Settings2Icon />
                  {t('settings')}
                </SidebarNavigationItem>
                <SidebarNavigationItem to="/plugins">
                  <BlocksIcon />
                  {t('plugins')}
                </SidebarNavigationItem>
                <SidebarNavigationItem to="/themes">
                  <PaletteIcon />
                  {t('themes')}
                </SidebarNavigationItem>
                <SidebarNavigationItem to="/logs">
                  <ScrollTextIcon />
                  {t('logs')}
                </SidebarNavigationItem>
              </SidebarNavigationCollapsible>
              <SidebarNavigationCollapsible
                title={t('collection')}
                icon={<LibraryIcon />}
              >
                <SidebarNavigationItem to="/favorites/albums">
                  <DiscIcon />
                  {t('favoriteAlbums')}
                </SidebarNavigationItem>
                <SidebarNavigationItem to="/favorites/tracks">
                  <MusicIcon />
                  {t('favoriteTracks')}
                </SidebarNavigationItem>
                <SidebarNavigationItem to="/favorites/artists">
                  <UserIcon />
                  {t('favoriteArtists')}
                </SidebarNavigationItem>
                <SidebarNavigationItem to="/playlists">
                  <ListMusicIcon />
                  {t('playlists')}
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
