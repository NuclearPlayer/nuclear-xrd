import userEvent from '@testing-library/user-event';

import { CardsRowWrapper as Wrapper } from './CardsRow.test-wrapper';

describe('CardsRow', () => {
  it('(Snapshot) renders correctly with items', () => {
    const { container } = Wrapper.mount();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders all card titles when no filter is applied', () => {
    Wrapper.mount();

    expect(Wrapper.card('Midnight Drive')).toBeInTheDocument();
    expect(Wrapper.card('Northern Lights')).toBeInTheDocument();
    expect(Wrapper.card('Echoes of Silence')).toBeInTheDocument();
  });

  it('filters cards by title when user types in the filter input', async () => {
    Wrapper.mount();

    await Wrapper.filter.type('midnight');

    expect(Wrapper.card('Midnight Drive')).toBeInTheDocument();
    expect(Wrapper.card('Northern Lights')).not.toBeInTheDocument();
    expect(Wrapper.card('Echoes of Silence')).not.toBeInTheDocument();
  });

  it('shows nothing found state when filter matches no cards', async () => {
    Wrapper.mount();

    await Wrapper.filter.type('zzzzz');

    expect(Wrapper.nothingFound).toBeInTheDocument();
    expect(Wrapper.cards).toHaveLength(0);
  });

  it('clears the filter when the clear filter button is clicked', async () => {
    Wrapper.mount();

    await Wrapper.filter.type('midnight');
    expect(Wrapper.cards).toHaveLength(1);

    await Wrapper.filter.clear();
    expect(Wrapper.cards).toHaveLength(3);
    expect(Wrapper.filter.input).toHaveValue('');
  });

  it('calls onClick when a card is clicked', async () => {
    const handleClick = vi.fn();
    Wrapper.mount({
      items: [{ id: '1', title: 'Clickable Album', onClick: handleClick }],
    });

    await userEvent.click(Wrapper.card('Clickable Album')!);

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
