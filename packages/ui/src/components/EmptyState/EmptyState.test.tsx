import { render } from '@testing-library/react';
import { Inbox, Search, WifiOff } from 'lucide-react';

import { Button } from '../Button';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('(Snapshot) renders with title only', () => {
    const { container } = render(<EmptyState title="No items found" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders with title and description', () => {
    const { container } = render(
      <EmptyState
        title="No plugins installed"
        description="Browse the store to find plugins for your music player."
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders with icon', () => {
    const { container } = render(
      <EmptyState
        icon={<Inbox size={64} />}
        title="Your inbox is empty"
        description="New messages will appear here."
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders with action button', () => {
    const { container } = render(
      <EmptyState
        icon={<WifiOff size={64} />}
        title="Connection failed"
        description="Could not reach the server."
        action={<Button>Retry</Button>}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders all size variants', () => {
    const { container } = render(
      <div className="flex flex-col gap-8">
        <EmptyState
          size="sm"
          icon={<Search size={32} />}
          title="Small size"
          description="Compact empty state"
        />
        <EmptyState
          size="default"
          icon={<Search size={48} />}
          title="Default size"
          description="Standard empty state"
        />
        <EmptyState
          size="lg"
          icon={<Search size={64} />}
          title="Large size"
          description="Spacious empty state"
        />
      </div>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with custom className', () => {
    const { getByTestId } = render(
      <EmptyState title="Test" className="custom-class" />,
    );
    expect(getByTestId('empty-state')).toHaveClass('custom-class');
  });
});
