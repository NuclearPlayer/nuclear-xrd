import type { Meta, StoryObj } from '@storybook/react-vite';

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
    imageReveal: { control: 'boolean' },
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

export const WithoutText: Story = {
  args: {
    src: cover,
  },
};

export const WithoutSubtitle: Story = {
  args: {
    src: cover,
    title: "Joe's Garage",
  },
};

export const WithoutImage: Story = {
  args: {
    src: '',
    title: 'No Image',
    subtitle: 'Some Artist',
  },
};

export const WithoutReveal: Story = {
  args: {
    src: cover,
    title: 'Random Album',
    subtitle: 'Some Artist',
    imageReveal: false,
  },
};
