import { Meta, StoryObj } from '@storybook/react-vite';

import { LogEntry } from '@nuclearplayer/ui';

import {
  allVariantEntries,
  collapsibleEntry,
  longSingleLineEntry,
} from './log-stories.data';

const meta = {
  title: 'Components/LogEntry',
  component: LogEntry,
  tags: ['autodocs'],
} satisfies Meta<typeof LogEntry>;

export default meta;

type Story = StoryObj<typeof LogEntry>;

export const AllVariants: Story = {
  render: () => (
    <div className="bg-background flex flex-col">
      {allVariantEntries.map((entry, index) => (
        <LogEntry
          key={entry.id}
          entry={entry}
          index={index}
          onLevelClick={(level) => console.log('Level clicked:', level)}
          onScopeClick={(scope) => console.log('Scope clicked:', scope)}
        />
      ))}
    </div>
  ),
};

export const LongSingleLineMessage: Story = {
  render: () => (
    <div className="bg-background flex flex-col">
      <LogEntry
        entry={longSingleLineEntry}
        index={0}
        onLevelClick={(level) => console.log('Level clicked:', level)}
        onScopeClick={(scope) => console.log('Scope clicked:', scope)}
      />
    </div>
  ),
};

export const CollapsibleMessage: Story = {
  render: () => (
    <div className="bg-background flex flex-col">
      <LogEntry
        entry={collapsibleEntry}
        index={0}
        onLevelClick={(level) => console.log('Level clicked:', level)}
        onScopeClick={(scope) => console.log('Scope clicked:', scope)}
      />
    </div>
  ),
};
