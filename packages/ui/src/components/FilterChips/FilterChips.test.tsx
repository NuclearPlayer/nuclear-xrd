import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FilterChip, FilterChips } from './FilterChips';

const mockItems: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'streaming', label: 'Streaming' },
  { id: 'metadata', label: 'Metadata' },
];

describe('FilterChips', () => {
  it('(Snapshot) renders single-select mode', () => {
    const { container } = render(
      <FilterChips items={mockItems} selected="all" onChange={vi.fn()} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('(Snapshot) renders multi-select mode', () => {
    const { container } = render(
      <FilterChips
        multiple
        items={mockItems}
        selected={['all', 'streaming']}
        onChange={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('single select: calls onChange with clicked id', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { getByRole } = render(
      <FilterChips items={mockItems} selected="all" onChange={handleChange} />,
    );

    await user.click(getByRole('radio', { name: 'Streaming' }));
    expect(handleChange).toHaveBeenCalledWith('streaming');
  });

  it('multi select: toggles selection on click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { getByRole, rerender } = render(
      <FilterChips
        multiple
        items={mockItems}
        selected={['all']}
        onChange={handleChange}
      />,
    );

    await user.click(getByRole('checkbox', { name: 'Streaming' }));
    expect(handleChange).toHaveBeenCalledWith(['all', 'streaming']);

    rerender(
      <FilterChips
        multiple
        items={mockItems}
        selected={['all', 'streaming']}
        onChange={handleChange}
      />,
    );

    await user.click(getByRole('checkbox', { name: 'All' }));
    expect(handleChange).toHaveBeenCalledWith(['streaming']);
  });
});
