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
    title: 'Why Does it Hurt When I Pee?',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    source: { provider: 'local', id: '1' },
  },
  {
    title: 'The Return of the Son of Monster Magnet',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    source: { provider: 'local', id: '2' },
  },
  {
    title: 'Waka/Jawaka',
    artists: [{ name: 'Frank Zappa', roles: [] }],
    source: { provider: 'local', id: '3' },
  },
];

export const Basic: Story = {
  render: () => <TrackTable tracks={tracks} />,
};
