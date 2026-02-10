import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Heart,
  ListMusic,
  ListPlus,
  MoreHorizontal,
  Play,
  SkipForward,
} from 'lucide-react';
import { FC, ReactNode, useState } from 'react';

import { Button, TrackContextMenu } from '@nuclearplayer/ui';

const meta: Meta<typeof TrackContextMenu> = {
  title: 'Components/TrackContextMenu',
  component: TrackContextMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Meta<typeof TrackContextMenu>>;

type MenuShellProps = {
  title: string;
  subtitle: string;
  coverSeed: string;
  children: ReactNode;
};

const MenuShell: FC<MenuShellProps> = ({
  title,
  subtitle,
  coverSeed,
  children,
}) => (
  <TrackContextMenu>
    <TrackContextMenu.Trigger>
      <Button size="icon">
        <MoreHorizontal size={20} />
      </Button>
    </TrackContextMenu.Trigger>
    <TrackContextMenu.Content>
      <TrackContextMenu.Header
        title={title}
        subtitle={subtitle}
        coverUrl={`https://picsum.photos/seed/${coverSeed}/64/64`}
      />
      {children}
    </TrackContextMenu.Content>
  </TrackContextMenu>
);

const commonActions = [
  { label: 'Play now', icon: <Play size={16} /> },
  { label: 'Add to queue', icon: <ListPlus size={16} /> },
  { label: 'Play next', icon: <SkipForward size={16} /> },
];

const CommonActions: FC<{ onClick?: (label: string) => void }> = ({
  onClick = () => {},
}) => (
  <>
    {commonActions.map(({ label, icon }) => (
      <TrackContextMenu.Action
        key={label}
        icon={icon}
        onClick={() => onClick(label)}
      >
        {label}
      </TrackContextMenu.Action>
    ))}
  </>
);

export const Default: Story = {
  render: () => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
      <MenuShell title="Bohemian Rhapsody" subtitle="Queen" coverSeed="queen">
        <TrackContextMenu.Action
          icon={
            <Heart
              size={16}
              className={isFavorite ? 'fill-accent-red text-accent-red' : ''}
            />
          }
          onClick={() => setIsFavorite(!isFavorite)}
        >
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </TrackContextMenu.Action>
        <CommonActions />
      </MenuShell>
    );
  },
};

const fewPlaylists = [
  { id: '1', name: 'Road Trip' },
  { id: '2', name: 'Late Night' },
  { id: '3', name: 'Workout Mix' },
];

const manyPlaylists = [
  ...fewPlaylists,
  { id: '4', name: 'Focus & Study' },
  { id: '5', name: 'Sunday Morning' },
  { id: '6', name: 'Party Bangers' },
  { id: '7', name: 'Acoustic Chill' },
  { id: '8', name: '90s Nostalgia' },
];

type PlaylistOption = { id: string; name: string };

type SubmenuDemoProps = {
  label: string;
  title: string;
  subtitle: string;
  coverSeed: string;
  playlists: PlaylistOption[];
  onAction: (action: string) => void;
};

const SubmenuDemo: FC<SubmenuDemoProps> = ({
  label,
  title,
  subtitle,
  coverSeed,
  playlists,
  onAction,
}) => (
  <div className="flex flex-col items-center gap-2">
    <span className="text-foreground-secondary text-xs">{label}</span>
    <MenuShell title={title} subtitle={subtitle} coverSeed={coverSeed}>
      <CommonActions onClick={onAction} />
      <TrackContextMenu.Submenu
        label="Add to playlist"
        icon={<ListMusic size={16} />}
        playlists={playlists}
        onSelect={(id) => {
          const name = playlists.find((p) => p.id === id)?.name;
          onAction(`Added to "${name}"`);
        }}
        filterPlaceholder="Filter playlists..."
      />
    </MenuShell>
  </div>
);

export const WithPlaylistSubmenu: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState('');

    return (
      <div className="flex items-start gap-8">
        <SubmenuDemo
          label="Few playlists"
          title="Stairway to Heaven"
          subtitle="Led Zeppelin"
          coverSeed="zeppelin"
          playlists={fewPlaylists}
          onAction={setLastAction}
        />
        <SubmenuDemo
          label="Many playlists (with filter)"
          title="Paranoid Android"
          subtitle="Radiohead"
          coverSeed="radiohead"
          playlists={manyPlaylists}
          onAction={setLastAction}
        />
        {lastAction && (
          <div className="text-foreground-secondary text-sm">
            Last action: {lastAction}
          </div>
        )}
      </div>
    );
  },
};
