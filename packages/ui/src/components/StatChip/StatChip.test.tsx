import { render, screen } from '@testing-library/react';

import { StatChip } from './StatChip';

describe('StatChip', () => {
  it('(Snapshot) renders with value and label', () => {
    const { container } = render(<StatChip value="1952" label="Year" />);
    expect(container).toMatchSnapshot();
  });

  it('(Snapshot) renders with icon', () => {
    const { container } = render(
      <StatChip
        value="42"
        label="Tracks"
        icon={<svg data-testid="test-icon" />}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the icon when provided', () => {
    render(
      <StatChip
        value="99"
        label="Followers"
        icon={<svg data-testid="test-icon" />}
      />,
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('does not render icon wrapper when no icon provided', () => {
    const { container } = render(<StatChip value="5" label="Items" />);
    const chipDiv = container.firstElementChild!;
    expect(chipDiv.children).toHaveLength(2);
  });

  it('merges custom className', () => {
    const { container } = render(
      <StatChip value="7" label="Days" className="custom-class" />,
    );
    expect(container.firstElementChild).toHaveClass('custom-class');
  });
});
