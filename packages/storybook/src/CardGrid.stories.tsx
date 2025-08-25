import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardGrid } from '@nuclearplayer/ui';

const meta = {
  title: 'Layout/CardGrid',
  component: CardGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cover = 'https://picsum.photos/300';

const items = [
  { title: 'Northern Lights', subtitle: 'Aurora' },
  { title: 'Midnight Drive', subtitle: 'Neon City' },
  { title: 'Echoes', subtitle: 'The Wanderers' },
  { title: 'Fragments', subtitle: 'Kite & Co.' },
  { title: 'Citrus Skies', subtitle: 'Mango Groove' },
  { title: 'Binary Love', subtitle: '01100010' },
  { title: 'Crimson Tide', subtitle: 'Harbor' },
  { title: 'Static Bloom', subtitle: 'Flora' },
  { title: 'Sunset Motifs', subtitle: 'Parasol' },
  { title: 'Hologram', subtitle: 'Vapors' },
  { title: 'Sapphire', subtitle: 'Depths' },
  { title: 'Granite', subtitle: 'Cliff' },
];

export const Default: Story = {
  render: () => (
    <div className="w-full">
      <CardGrid>
        {items.map((item, i) => (
          <Card
            key={i}
            src={`${cover}?i=${i}`}
            title={item.title}
            subtitle={item.subtitle}
          />
        ))}
      </CardGrid>
    </div>
  ),
};
