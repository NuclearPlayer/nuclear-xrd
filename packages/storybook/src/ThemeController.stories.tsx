import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ThemeController } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/ThemeController',
  component: ThemeController,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    isDark: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof ThemeController>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => {
    const [isDark, setIsDark] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <ThemeController isDark={isDark} onThemeChange={setIsDark} />
        <p className="text-foreground text-sm">
          Current theme: {isDark ? 'Dark' : 'Light'}
        </p>
      </div>
    );
  },
};
