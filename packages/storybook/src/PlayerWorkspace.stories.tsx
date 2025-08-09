import type { Meta } from '@storybook/react';
import {
  Clock,
  Disc3,
  Download,
  Filter,
  Grid3X3,
  Heart,
  Home,
  Library,
  List,
  Mic2,
  MoreHorizontal,
  Music,
  Play,
  Radio,
  Repeat,
  Search,
  Settings,
  Shuffle,
  SkipBack,
  SkipForward,
  Star,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import { useState } from 'react';

import {
  BottomBar,
  Button,
  PlayerWorkspace,
  SidebarNavigation,
  SidebarNavigationCollapsible,
  SidebarNavigationItem,
  TopBar,
} from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/PlayerWorkspace',
  component: PlayerWorkspace,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerWorkspace>;

export default meta;

const MockTrackList = () => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-foreground">Your Library</h1>
      <div className="flex gap-2">
        <Button size="sm" variant="text">
          <Filter size={16} />
        </Button>
        <Button size="sm" variant="text">
          <Grid3X3 size={16} />
        </Button>
        <Button size="sm" variant="text">
          <List size={16} />
        </Button>
      </div>
    </div>

    <div className="space-y-2">
      {[
        {
          title: 'Bohemian Rhapsody',
          artist: 'Queen',
          album: 'A Night at the Opera',
          duration: '5:55',
        },
        {
          title: 'Stairway to Heaven',
          artist: 'Led Zeppelin',
          album: 'Led Zeppelin IV',
          duration: '8:02',
        },
        {
          title: 'Hotel California',
          artist: 'Eagles',
          album: 'Hotel California',
          duration: '6:30',
        },
        {
          title: "Sweet Child O' Mine",
          artist: "Guns N' Roses",
          album: 'Appetite for Destruction',
          duration: '5:03',
        },
        {
          title: 'Imagine',
          artist: 'John Lennon',
          album: 'Imagine',
          duration: '3:07',
        },
        {
          title: 'Billie Jean',
          artist: 'Michael Jackson',
          album: 'Thriller',
          duration: '4:54',
        },
        {
          title: 'Like a Rolling Stone',
          artist: 'Bob Dylan',
          album: 'Highway 61 Revisited',
          duration: '6:13',
        },
        {
          title: 'Smells Like Teen Spirit',
          artist: 'Nirvana',
          album: 'Nevermind',
          duration: '5:01',
        },
      ].map((track, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 hover:bg-background rounded border border-transparent hover:border-border transition-all"
        >
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="text"
              className="opacity-0 group-hover:opacity-100"
            >
              <Play size={14} />
            </Button>
            <div>
              <div className="font-medium text-foreground">{track.title}</div>
              <div className="text-sm text-foreground-secondary">
                {track.artist} • {track.album}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground-secondary">
              {track.duration}
            </span>
            <Button size="icon" variant="text">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MockQueueSidebar = () => (
  <div className="p-4">
    <h3 className="font-bold text-foreground mb-4">Queue</h3>
    <div className="space-y-3">
      <div className="text-sm">
        <div className="font-medium text-foreground">Now Playing</div>
        <div className="text-foreground-secondary">
          Bohemian Rhapsody - Queen
        </div>
      </div>
      <div className="border-t border-border pt-3">
        <div className="text-sm font-medium text-foreground mb-2">Up Next</div>
        {[
          'Stairway to Heaven - Led Zeppelin',
          'Hotel California - Eagles',
          "Sweet Child O' Mine - Guns N' Roses",
        ].map((track, index) => (
          <div
            key={index}
            className="text-sm text-foreground-secondary py-1 hover:text-foreground cursor-pointer"
          >
            {track}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const BasicLayout = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(320);

  return (
    <div className="h-screen flex flex-col">
      <TopBar>
        <div className="ml-4 flex items-center gap-4">
          <span className="text-sm text-foreground">Nuclear Music Player</span>
        </div>
      </TopBar>

      <PlayerWorkspace className="flex-1">
        <PlayerWorkspace.LeftSidebar
          isCollapsed={leftCollapsed}
          width={leftWidth}
          onWidthChange={setLeftWidth}
          onToggle={() => setLeftCollapsed(!leftCollapsed)}
        >
          <SidebarNavigation>
            <SidebarNavigationItem isSelected>
              <Home size={16} />
              <span>Home</span>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <Search size={16} />
              <span>Search</span>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <Library size={16} />
              <span>Your Library</span>
            </SidebarNavigationItem>
          </SidebarNavigation>
        </PlayerWorkspace.LeftSidebar>

        <PlayerWorkspace.Main>
          <MockTrackList />
        </PlayerWorkspace.Main>

        <PlayerWorkspace.RightSidebar
          isCollapsed={rightCollapsed}
          width={rightWidth}
          onWidthChange={setRightWidth}
          onToggle={() => setRightCollapsed(!rightCollapsed)}
        >
          <MockQueueSidebar />
        </PlayerWorkspace.RightSidebar>
      </PlayerWorkspace>

      <BottomBar>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button size="icon" variant="text">
                <Shuffle size={16} />
              </Button>
              <Button size="icon" variant="text">
                <SkipBack size={16} />
              </Button>
              <Button size="icon">
                <Play size={16} />
              </Button>
              <Button size="icon" variant="text">
                <SkipForward size={16} />
              </Button>
              <Button size="icon" variant="text">
                <Repeat size={16} />
              </Button>
            </div>
          </div>

          <div className="flex-1 mx-8">
            <div className="text-center">
              <div className="text-sm font-medium text-foreground">
                Bohemian Rhapsody
              </div>
              <div className="text-xs text-foreground-secondary">Queen</div>
            </div>
            <div className="mt-2 bg-background-secondary rounded-full h-1">
              <div className="bg-primary h-1 rounded-full w-1/3"></div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="text">
              <Volume2 size={16} />
            </Button>
            <div className="w-20 bg-background-secondary rounded-full h-1">
              <div className="bg-primary h-1 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      </BottomBar>
    </div>
  );
};

export const FullNavigationLayout = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(280);

  return (
    <div className="h-screen flex flex-col">
      <TopBar>
        <div className="ml-4 flex items-center gap-4">
          <span className="text-sm text-foreground font-medium">
            Nuclear Music Player
          </span>
          <div className="flex gap-2 ml-8">
            <Button size="sm" variant="text">
              File
            </Button>
            <Button size="sm" variant="text">
              Edit
            </Button>
            <Button size="sm" variant="text">
              View
            </Button>
            <Button size="sm" variant="text">
              Help
            </Button>
          </div>
        </div>
      </TopBar>

      <PlayerWorkspace className="flex-1">
        <PlayerWorkspace.LeftSidebar
          isCollapsed={leftCollapsed}
          width={leftWidth}
          onWidthChange={setLeftWidth}
          onToggle={() => setLeftCollapsed(!leftCollapsed)}
        >
          <SidebarNavigation>
            <SidebarNavigationItem isSelected>
              <Home size={16} />
              <span>Home</span>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <Search size={16} />
              <span>Search</span>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <Library size={16} />
              <span>Your Library</span>
            </SidebarNavigationItem>

            <SidebarNavigationCollapsible
              title="Your Music"
              icon={<Music size={16} />}
            >
              <SidebarNavigationItem>
                <Heart size={16} />
                <span>Liked Songs</span>
              </SidebarNavigationItem>
              <SidebarNavigationItem isSelected>
                <Clock size={16} />
                <span>Recently Played</span>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <Download size={16} />
                <span>Downloaded</span>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <Star size={16} />
                <span>Favorites</span>
              </SidebarNavigationItem>
            </SidebarNavigationCollapsible>

            <SidebarNavigationCollapsible
              title="Browse"
              icon={<TrendingUp size={16} />}
            >
              <SidebarNavigationItem>
                <Disc3 size={16} />
                <span>Albums</span>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <Mic2 size={16} />
                <span>Artists</span>
              </SidebarNavigationItem>
              <SidebarNavigationItem>
                <Radio size={16} />
                <span>Radio</span>
              </SidebarNavigationItem>
            </SidebarNavigationCollapsible>

            <SidebarNavigationItem>
              <Settings size={16} />
              <span>Settings</span>
            </SidebarNavigationItem>
          </SidebarNavigation>
        </PlayerWorkspace.LeftSidebar>

        <PlayerWorkspace.Main>
          <MockTrackList />
        </PlayerWorkspace.Main>

        <PlayerWorkspace.RightSidebar
          isCollapsed={rightCollapsed}
          width={rightWidth}
          onWidthChange={setRightWidth}
          onToggle={() => setRightCollapsed(!rightCollapsed)}
        >
          <MockQueueSidebar />
        </PlayerWorkspace.RightSidebar>
      </PlayerWorkspace>

      <BottomBar>
        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center gap-4">
            <span className="text-foreground">♪ 1,247 tracks</span>
            <span className="text-foreground-secondary">•</span>
            <span className="text-foreground-secondary">3.2 GB</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-foreground-secondary">Ready</span>
          </div>
        </div>
      </BottomBar>
    </div>
  );
};
