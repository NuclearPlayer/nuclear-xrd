import type { Meta, StoryObj } from '@storybook/react';

import { PlayerBar } from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/PlayerBar',
  component: PlayerBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const cover = 'https://picsum.photos/64';

export const Default: Story = {
  render: () => (
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
  ),
};

export const ActiveStates: Story = {
  render: () => (
    <PlayerBar
      left={
        <PlayerBar.NowPlaying
          title="Crystalized"
          artist="XX"
          coverUrl={cover}
        />
      }
      center={<PlayerBar.Controls isPlaying isShuffleActive isRepeatActive />}
      right={<PlayerBar.Volume defaultValue={60} />}
    />
  ),
};

export const NoArtwork: Story = {
  render: () => (
    <PlayerBar
      left={
        <PlayerBar.NowPlaying title="Untitled Track" artist="Unknown Artist" />
      }
      center={<PlayerBar.Controls />}
      right={<PlayerBar.Volume defaultValue={30} />}
    />
  ),
};

export const LongMetadata: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <PlayerBar
        left={
          <PlayerBar.NowPlaying
            title="An Incredibly, Ridiculously Long Song Title That Should Truncate Nicely"
            artist="A Very Long Artist Name Featuring Another Long Artist With Even More Characters"
            coverUrl={cover}
          />
        }
        center={<PlayerBar.Controls />}
        right={<PlayerBar.Volume defaultValue={50} />}
      />
    </div>
  ),
};
