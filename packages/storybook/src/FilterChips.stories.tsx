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

const categories: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'streaming', label: 'Streaming' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'lyrics', label: 'Lyrics' },
  { id: 'other', label: 'Other' },
];

export const Interactive: Story = {
  render: () => {
    const [single, setSingle] = useState('all');
    const [multi, setMulti] = useState(['streaming', 'metadata']);

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-foreground text-sm font-semibold">
            Single Select
          </h3>
          <FilterChips
            items={categories}
            selected={single}
            onChange={setSingle}
          />
          <p className="text-foreground/60 text-xs">Selected: {single}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-foreground text-sm font-semibold">
            Multi Select
          </h3>
          <FilterChips
            multiple
            items={categories}
            selected={multi}
            onChange={setMulti}
          />
          <p className="text-foreground/60 text-xs">
            Selected: {multi.length > 0 ? multi.join(', ') : 'none'}
          </p>
        </div>
      </div>
    );
  },
};
