import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { Track } from '@nuclearplayer/model';

import { QueueItem } from './QueueItem';

const mockTrack: Track = {
  title: 'Bohemian Rhapsody',
  artists: [{ name: 'Queen', roles: ['primary'] }],
  durationMs: 354000,
  source: { provider: 'test', id: '1' },
  artwork: {
    items: [
      {
        url: 'https://picsum.photos/seed/queen/300',
        width: 300,
        height: 300,
        purpose: 'thumbnail',
      },
    ],
  },
};

describe('QueueItem', () => {
  it('(Snapshot) renders default state', () => {
    const { container } = render(
      <QueueItem track={mockTrack} onSelect={vi.fn()} onRemove={vi.fn()} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders current state', () => {
    const { container } = render(
      <QueueItem
        track={mockTrack}
        isCurrent={true}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders loading state', () => {
    const { container } = render(
      <QueueItem
        track={mockTrack}
        status="loading"
        onSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders error state', () => {
    const { container } = render(
      <QueueItem
        track={mockTrack}
        status="error"
        errorMessage="Failed to load stream"
        onSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders collapsed state', () => {
    const { container } = render(
      <QueueItem track={mockTrack} isCollapsed={true} onSelect={vi.fn()} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders collapsed state without onSelect', () => {
    const { container } = render(
      <QueueItem track={mockTrack} isCollapsed={true} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn();
    render(<QueueItem track={mockTrack} onSelect={onSelect} />);
    await userEvent.click(screen.getByTestId('queue-item'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const onRemove = vi.fn();
    render(<QueueItem track={mockTrack} onRemove={onRemove} />);
    await userEvent.click(screen.getByTestId('queue-item-remove-button'));
    expect(onRemove).toHaveBeenCalled();
  });

  it('renders without callbacks', () => {
    const { container } = render(<QueueItem track={mockTrack} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
