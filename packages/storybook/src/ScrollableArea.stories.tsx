import type { Meta, StoryObj } from '@storybook/react';

import { ScrollableArea } from '@nuclearplayer/ui';

const meta: Meta<typeof ScrollableArea> = {
  title: 'Components/ScrollableArea',
  component: ScrollableArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const VerticalContent = () => (
  <div className="w-64 space-y-4">
    {Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="h-16 bg-primary border-2 border-border rounded p-4 flex items-center justify-center text-foreground"
      >
        Item {i + 1}
      </div>
    ))}
  </div>
);

const HorizontalContent = () => (
  <div className="h-64 flex space-x-4">
    {Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="w-32 flex-shrink-0 bg-primary border-2 border-border rounded p-4 flex items-center justify-center text-foreground"
      >
        Item {i + 1}
      </div>
    ))}
  </div>
);

const BothScrollContent = () => (
  <div className="space-y-4">
    {Array.from({ length: 20 }, (_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: 10 }, (_, j) => (
          <div
            key={j}
            className="w-32 h-16 flex-shrink-0 bg-primary border-2 border-border rounded p-2 flex items-center justify-center text-foreground text-sm"
          >
            {i + 1}-{j + 1}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const VerticalScroll: Story = {
  render: () => (
    <div className="w-80 h-96 border-2 border-border">
      <ScrollableArea>
        <VerticalContent />
      </ScrollableArea>
    </div>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <div className="w-80 h-80 border-2 border-border">
      <ScrollableArea>
        <HorizontalContent />
      </ScrollableArea>
    </div>
  ),
};

export const BothScrolls: Story = {
  render: () => (
    <div className="w-96 h-96 border-2 border-border">
      <ScrollableArea>
        <BothScrollContent />
      </ScrollableArea>
    </div>
  ),
};
