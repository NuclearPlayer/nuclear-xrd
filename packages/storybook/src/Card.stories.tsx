import type { Meta, StoryObj } from '@storybook/react';

import { Card } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const cover = 'https://picsum.photos/300';

export const Default: Story = {
  args: {
    src: cover,
    title: 'Random Album',
    subtitle: 'Some Artist',
  },
};

export const WithLongText: Story = {
  args: {
    src: cover,
    title:
      'An Incredibly, Ridiculously Long Album Title That Should Truncate Nicely',
    subtitle:
      'A Very Long Artist Name Featuring Another Artist With Even More Characters',
  },
};
