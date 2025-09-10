import type { Meta } from '@storybook/react-vite';
import {
  Clock,
  Disc3,
  Download,
  Folder,
  Heart,
  Home,
  Library,
  Mic2,
  Music,
  Radio,
  Search,
  Settings,
  Star,
  TrendingUp,
} from 'lucide-react';

import {
  SidebarNavigation,
  SidebarNavigationCollapsible,
  SidebarNavigationItem,
} from '@nuclearplayer/ui';

const meta = {
  title: 'Navigation/SidebarNavigation',
  component: SidebarNavigation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SidebarNavigation>;

export default meta;

export const BasicNavigation = () => (
  <div className="bg-background-secondary border-border h-96 w-64 border-2 p-4">
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
  </div>
);

export const WithCollapsibleSections = () => (
  <div className="bg-background-secondary border-border h-96 w-64 border-2 p-4">
    <SidebarNavigation>
      <SidebarNavigationItem isSelected>
        <Home size={16} />
        <span>Home</span>
      </SidebarNavigationItem>
      <SidebarNavigationItem>
        <Search size={16} />
        <span>Search</span>
      </SidebarNavigationItem>

      <SidebarNavigationCollapsible
        title="Your Music"
        icon={<Music size={16} />}
      >
        <SidebarNavigationItem>
          <Heart size={16} />
          <span>Liked Songs</span>
        </SidebarNavigationItem>
        <SidebarNavigationItem>
          <Clock size={16} />
          <span>Recently Played</span>
        </SidebarNavigationItem>
        <SidebarNavigationItem>
          <Download size={16} />
          <span>Downloaded</span>
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
    </SidebarNavigation>
  </div>
);

export const FullNavigationExample = () => (
  <div className="bg-background-secondary border-border h-[600px] w-64 overflow-auto border-2 p-4">
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
        <SidebarNavigationItem>
          <TrendingUp size={16} />
          <span>Charts</span>
        </SidebarNavigationItem>
      </SidebarNavigationCollapsible>

      <SidebarNavigationCollapsible
        title="Local Files"
        icon={<Folder size={16} />}
      >
        <SidebarNavigationItem>
          <Folder size={16} />
          <span>Music Folder</span>
        </SidebarNavigationItem>
        <SidebarNavigationItem>
          <Download size={16} />
          <span>Downloads</span>
        </SidebarNavigationItem>
      </SidebarNavigationCollapsible>

      <SidebarNavigationItem>
        <Settings size={16} />
        <span>Settings</span>
      </SidebarNavigationItem>
    </SidebarNavigation>
  </div>
);
