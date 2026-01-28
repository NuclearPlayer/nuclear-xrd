import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { FilterChip, FilterChips } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/FilterChips',
  component: FilterChips,
  tags: ['autodocs'],
} satisfies Meta<typeof FilterChips>;

export default meta;

type Story = StoryObj<typeof FilterChips>;

const pluginCategories: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'streaming', label: 'Streaming' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'lyrics', label: 'Lyrics' },
  { id: 'scrobbling', label: 'Scrobbling' },
  { id: 'other', label: 'Other' },
];

export const PluginCategories: Story = {
  args: {
    items: pluginCategories,
    selected: 'all',
    onChange: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState('all');
    return (
      <div className="flex flex-col gap-4">
        <FilterChips
          items={pluginCategories}
          selected={selected}
          onChange={setSelected}
        />
        <p className="text-foreground-secondary text-sm">
          Selected: <strong className="text-foreground">{selected}</strong>
        </p>
      </div>
    );
  },
};
