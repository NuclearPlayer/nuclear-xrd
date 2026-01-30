import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Heart,
  ListPlus,
  MoreHorizontal,
  Play,
  SkipForward,
} from 'lucide-react';
import { useState } from 'react';

import { Button, TrackContextMenu } from '@nuclearplayer/ui';

const meta: Meta<typeof TrackContextMenu> = {
  title: 'Components/TrackContextMenu',
  component: TrackContextMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Meta<typeof TrackContextMenu>>;

export const Default: Story = {
  render: () => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
      <TrackContextMenu>
        <TrackContextMenu.Trigger>
          <Button size="icon">
            <MoreHorizontal size={20} />
          </Button>
        </TrackContextMenu.Trigger>
        <TrackContextMenu.Content>
          <TrackContextMenu.Header
            title="Bohemian Rhapsody"
            subtitle="Queen"
            coverUrl="https://picsum.photos/seed/queen/64/64"
          />
          <div className="py-1">
            <TrackContextMenu.Action
              icon={
                <Heart
                  size={16}
                  className={
                    isFavorite ? 'fill-accent-red text-accent-red' : ''
                  }
                />
              }
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </TrackContextMenu.Action>
            <TrackContextMenu.Action
              icon={<Play size={16} />}
              onClick={() => {}}
            >
              Play now
            </TrackContextMenu.Action>
            <TrackContextMenu.Action
              icon={<ListPlus size={16} />}
              onClick={() => {}}
            >
              Add to queue
            </TrackContextMenu.Action>
            <TrackContextMenu.Action
              icon={<SkipForward size={16} />}
              onClick={() => {}}
            >
              Play next
            </TrackContextMenu.Action>
          </div>
        </TrackContextMenu.Content>
      </TrackContextMenu>
    );
  },
};
