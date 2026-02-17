import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CardsRow, CardsRowItem, CardsRowLabels } from './CardsRow';

const labels: CardsRowLabels = {
  filterPlaceholder: 'Filter cards...',
  nothingFound: 'Nothing found',
};

const items: CardsRowItem[] = [
  {
    id: '1',
    title: 'Midnight Drive',
    subtitle: 'Neon City',
    imageUrl: 'https://picsum.photos/300?random=1',
  },
  {
    id: '2',
    title: 'Northern Lights',
    subtitle: 'Aurora',
    imageUrl: 'https://picsum.photos/300?random=2',
  },
  {
    id: '3',
    title: 'Echoes of Silence',
    subtitle: 'The Wanderers',
    imageUrl: 'https://picsum.photos/300?random=3',
  },
];

describe('CardsRow', () => {
  it('(Snapshot) renders correctly with items', () => {
    const { container } = render(
      <CardsRow title="Top Albums" items={items} labels={labels} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders all card titles when no filter is applied', () => {
    render(<CardsRow title="Top Albums" items={items} labels={labels} />);

    const container = screen.getByTestId('cards-row');
    const cards = within(container).getAllByTestId('card');

    expect(cards).toHaveLength(3);
    expect(screen.getByText('Midnight Drive')).toBeInTheDocument();
    expect(screen.getByText('Northern Lights')).toBeInTheDocument();
    expect(screen.getByText('Echoes of Silence')).toBeInTheDocument();
  });

  it('filters cards by title when user types in the filter input', async () => {
    const user = userEvent.setup();
    render(<CardsRow title="Top Albums" items={items} labels={labels} />);

    const filterInput = screen.getByTestId('cards-row-filter');
    await user.type(filterInput, 'midnight');

    const container = screen.getByTestId('cards-row');
    const cards = within(container).getAllByTestId('card');

    expect(cards).toHaveLength(1);
    expect(screen.getByText('Midnight Drive')).toBeInTheDocument();
    expect(screen.queryByText('Northern Lights')).not.toBeInTheDocument();
    expect(screen.queryByText('Echoes of Silence')).not.toBeInTheDocument();
  });

  it('shows nothing found state when filter matches no cards', async () => {
    const user = userEvent.setup();
    render(<CardsRow title="Top Albums" items={items} labels={labels} />);

    const filterInput = screen.getByTestId('cards-row-filter');
    await user.type(filterInput, 'zzzzz');

    expect(screen.getByTestId('cards-row-nothing-found')).toBeInTheDocument();
    expect(screen.getByText('Nothing found')).toBeInTheDocument();

    const container = screen.getByTestId('cards-row');
    expect(within(container).queryAllByTestId('card')).toHaveLength(0);
  });

  it('clears the filter when the clear filter button is clicked', async () => {
    const user = userEvent.setup();
    render(<CardsRow title="Top Albums" items={items} labels={labels} />);

    const filterInput = screen.getByTestId('cards-row-filter');
    await user.type(filterInput, 'midnight');

    const container = screen.getByTestId('cards-row');
    expect(within(container).getAllByTestId('card')).toHaveLength(1);

    const clearButton = screen.getByTestId('cards-row-clear-filter');
    await user.click(clearButton);

    expect(within(container).getAllByTestId('card')).toHaveLength(3);
    expect(filterInput).toHaveValue('');
  });

  it('calls onClick when a card is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const clickableItems: CardsRowItem[] = [
      { id: '1', title: 'Clickable Album', onClick: handleClick },
    ];

    render(
      <CardsRow title="Top Albums" items={clickableItems} labels={labels} />,
    );

    const card = screen.getByTestId('card');
    await user.click(card);

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
