import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Track } from '@nuclearplayer/model';
import { TrackTable, TrackTableProps } from '@nuclearplayer/ui';

const meta: Meta<typeof TrackTable> = {
  title: 'Components/TrackTable',
  component: TrackTable,
  parameters: {
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on.*' },
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
    durationMs: 78 * 1000,
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
    durationMs: 45 * 1000,
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
    durationMs: 217 * 1000,
  },
];

export const Basic: Story = {
  args: {
    tracks,
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
  },
  render: (args) => <TrackTable {...(args as TrackTableProps)} />,
};

export const DragAndDrop: Story = {
  args: {
    tracks,
    features: {
      reorderable: true,
    },
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
  },
  render: (args) => {
    const [tracksState, setTracksState] = useState(args.tracks);
    return (
      <TrackTable
        {...args}
        tracks={tracksState}
        onReorder={(ids) => {
          const map = new Map(
            tracksState.map((track: Track) => [track.source.id, track]),
          );
          const reordered = ids
            .map((id) => map.get(id)!)
            .filter(Boolean) as Track[];
          const withUpdatedPositions = reordered.map((t, idx) => ({
            ...t,
            trackNumber: idx + 1,
          }));
          setTracksState(withUpdatedPositions);
        }}
      />
    );
  },
};

export const LargeDataset: Story = {
  args: {
    tracks: Array.from({ length: 5000 }).map(
      (_, i) =>
        ({
          trackNumber: i + 1,
          artwork: { items: [{ url: 'https://i.imgur.com/4euOws2.jpg' }] },
          title: `Virtualized Track ${i + 1}`,
          artists: [{ name: 'Frank Zappa', roles: [] }],
          album: {
            title: 'Huge Album',
            artists: [
              { name: 'Frank Zappa', source: { provider: 'local', id: '1' } },
            ],
            source: { provider: 'local', id: '1' },
          },
          source: { provider: 'local', id: `vt-${i + 1}` },
          durationMs: ((i % 320) + 30) * 1000,
        }) as Track,
    ),
    display: {
      displayPosition: true,
      displayThumbnail: true,
      displayArtist: true,
      displayAlbum: true,
      displayDuration: true,
    },
  },
  render: (args) => (
    <div className="h-100">
      <TrackTable {...(args as TrackTableProps)} />
    </div>
  ),
};
