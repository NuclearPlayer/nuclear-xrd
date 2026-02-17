import type { Meta, StoryObj } from '@storybook/react-vite';

import { CardsRow } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/CardsRow',
  component: CardsRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const labels = {
  filterPlaceholder: 'Filter albums...',
  nothingFound: 'No albums match your filter',
};

const items = [
  {
    id: '1',
    title: 'Midnight Drive',
    subtitle: 'Neon City',
    imageUrl: 'https://picsum.photos/300?random=1',
  },
  {
    id: '2',
    title: 'Northern Lights',
    subtitle: 'Aurora',
    imageUrl: 'https://picsum.photos/300?random=2',
  },
  {
    id: '3',
    title: 'Echoes of Silence',
    subtitle: 'The Wanderers',
    imageUrl: 'https://picsum.photos/300?random=3',
  },
  {
    id: '4',
    title: 'Fragments',
    subtitle: 'Kite & Co.',
    imageUrl: 'https://picsum.photos/300?random=4',
  },
  {
    id: '5',
    title: 'Citrus Skies',
    subtitle: 'Mango Groove',
    imageUrl: 'https://picsum.photos/300?random=5',
  },
  {
    id: '6',
    title: 'Binary Love',
    subtitle: '01100010',
    imageUrl: 'https://picsum.photos/300?random=6',
  },
  {
    id: '7',
    title: 'Crimson Tide',
    subtitle: 'Harbor',
    imageUrl: 'https://picsum.photos/300?random=7',
  },
  {
    id: '8',
    title: 'Static Bloom',
    subtitle: 'Flora',
    imageUrl: 'https://picsum.photos/300?random=8',
  },
  {
    id: '9',
    title: 'Sunset Motifs',
    subtitle: 'Parasol',
    imageUrl: 'https://picsum.photos/300?random=9',
  },
  {
    id: '10',
    title: 'Hologram',
    subtitle: 'Vapors',
    imageUrl: 'https://picsum.photos/300?random=10',
  },
];

export const WithItems: Story = {
  args: {
    title: 'Top Albums',
    items,
    labels,
  },
};

export const Empty: Story = {
  args: {
    title: 'Top Albums',
    items: [],
    labels,
  },
};
