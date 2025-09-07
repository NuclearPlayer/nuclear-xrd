import type { Meta, StoryObj } from '@storybook/react';

import { Track } from '@nuclearplayer/model';
import { TrackTable } from '@nuclearplayer/ui';

const meta: Meta<typeof TrackTable> = {
  title: 'Components/TrackTable',
  component: TrackTable,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<Meta<typeof TrackTable>>;

const tracks: Track[] = [
  {
    trackNumber: 1,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: 'Why Does it Hurt When I Pee?',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: "Joe's Garage",
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
      ],
      source: { provider: 'local', id: '1' },
    },
    source: { provider: 'local', id: '1' },
    durationMs: 60 * 1000,
  },
  {
    trackNumber: 2,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: 'The Return of the Son of Monster Magnet',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: 'Freak Out!',
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
      ],
      source: { provider: 'local', id: '1' },
    },
    source: { provider: 'local', id: '2' },
    durationMs: 60 * 1000,
  },
  {
    trackNumber: 3,
    artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
    title: 'Waka/Jawaka',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    album: {
      title: 'Waka/Jawaka',
      artists: [
        { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
      ],
      source: { provider: 'local', id: '1' },
    },
    source: { provider: 'local', id: '3' },
    durationMs: 60 * 1000,
  },
];

export const Basic: Story = {
  render: () => <TrackTable tracks={tracks} />,
};
