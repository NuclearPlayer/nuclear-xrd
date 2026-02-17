import { render, RenderResult, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CardsRow, CardsRowItem, CardsRowLabels } from './CardsRow';

const user = userEvent.setup();

const defaultLabels: CardsRowLabels = {
  filterPlaceholder: 'Filter cards...',
  nothingFound: 'Nothing found',
};

const defaultItems: CardsRowItem[] = [
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

type MountOptions = {
  title?: string;
  items?: CardsRowItem[];
  labels?: CardsRowLabels;
};

export const CardsRowWrapper = {
  mount(options: MountOptions = {}): RenderResult {
    const {
      title = 'Top Albums',
      items = defaultItems,
      labels = defaultLabels,
    } = options;

    return render(<CardsRow title={title} items={items} labels={labels} />);
  },

  get container() {
    return screen.getByTestId('cards-row');
  },

  get cards() {
    return within(this.container).queryAllByTestId('card');
  },

  card(title: string) {
    return (
      this.cards.find(
        (card) =>
          within(card).queryByTestId('card-title')?.textContent === title,
      ) ?? null
    );
  },

  get nothingFound() {
    return within(this.container).queryByTestId('cards-row-nothing-found');
  },

  filter: {
    get input() {
      return screen.getByTestId('cards-row-filter');
    },
    async type(text: string) {
      await user.type(this.input, text);
    },
    async clear() {
      await user.click(screen.getByTestId('cards-row-clear-filter'));
    },
  },

  fixtures: {
    defaultItems,
    defaultLabels,
  },
};
