import { Meta, StoryObj } from '@storybook/react';

import { Box } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
    shadow: {
      control: { type: 'select' },
      options: ['default', 'none'],
    },
  },
} satisfies Meta<typeof Box>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Box',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Box',
    variant: 'secondary',
  },
};

export const Tertiary = {
  args: {
    children: 'Box',
    variant: 'tertiary',
  },
};

export const NoShadow = {
  args: {
    children: 'Box',
    shadow: 'none',
  },
};
