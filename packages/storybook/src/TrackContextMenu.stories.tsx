import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Heart,
  ListMusic,
  ListPlus,
  MoreHorizontal,
  Play,
  SkipForward,
  Star,
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

export const WithSubmenu: Story = {
  render: () => (
    <MenuShell
      title="Stairway to Heaven"
      subtitle="Led Zeppelin"
      coverSeed="zeppelin"
    >
      <CommonActions />
      <TrackContextMenu.Submenu>
        <TrackContextMenu.SubmenuTrigger icon={<ListMusic size={16} />}>
          Add to collection
        </TrackContextMenu.SubmenuTrigger>
        <TrackContextMenu.SubmenuContent>
          <TrackContextMenu.Action icon={<Star size={16} />} onClick={() => {}}>
            Favorites
          </TrackContextMenu.Action>
          <TrackContextMenu.Action
            icon={<ListMusic size={16} />}
            onClick={() => {}}
          >
            Road Trip
          </TrackContextMenu.Action>
          <TrackContextMenu.Action
            icon={<ListMusic size={16} />}
            onClick={() => {}}
          >
            Late Night
          </TrackContextMenu.Action>
        </TrackContextMenu.SubmenuContent>
      </TrackContextMenu.Submenu>
    </MenuShell>
  ),
};
