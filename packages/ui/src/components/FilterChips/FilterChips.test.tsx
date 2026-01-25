import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FilterChip, FilterChips } from './FilterChips';

const mockItems: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'streaming', label: 'Streaming' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'lyrics', label: 'Lyrics' },
  { id: 'other', label: 'Other' },
];

describe('FilterChips', () => {
  it('(Snapshot) renders with a selected item', () => {
    const { container } = render(
      <FilterChips items={mockItems} selected="all" onChange={vi.fn()} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls onChange when chip is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { getByRole } = render(
      <FilterChips items={mockItems} selected="all" onChange={handleChange} />,
    );

    await user.click(getByRole('radio', { name: 'Streaming' }));

    expect(handleChange).toHaveBeenCalledWith('streaming');
  });

  it('applies custom className', () => {
    const { getByTestId } = render(
      <FilterChips
        items={mockItems}
        selected="all"
        onChange={vi.fn()}
        className="custom-class"
      />,
    );

    expect(getByTestId('filter-chips')).toHaveClass('custom-class');
  });
});
