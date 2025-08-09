import type { Meta, StoryObj } from '@storybook/react';

const Welcome = () => (
  <div className="p-8 max-w-2xl">
    <h1 className="text-4xl font-bold mb-6 text-foreground">
      Welcome to Nuclear Storybook! 🎵
    </h1>
    <p className="text-lg mb-6 text-foreground-secondary">
      This is the component development environment for the Nuclear music
      player. Here you can develop and test UI components in isolation.
    </p>
  </div>
);

const meta = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Welcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
