import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Box, Card, CardGrid, Loader } from '..';
import { Tabs } from './Tabs';

const ITEMS = [
  {
    id: 'artists',
    label: 'Artists',
    content: (
      <div className="text-foreground">
        <CardGrid>
          {[
            'Frank Zappa',
            'Ozzy Osbourne',
            'David Bowie',
            'Kurt Cobain',
            'John Lennon',
          ].map((item) => (
            <Card
              key={item}
              title={item}
              src={`https://picsum.photos/seed/${item}/300`}
            />
          ))}
        </CardGrid>
      </div>
    ),
  },
  {
    id: 'tracks',
    label: 'Tracks',
    content: (
      <div className="text-foreground">
        <Loader /> Still loading!
      </div>
    ),
  },
  {
    id: 'about',
    label: 'About',
    content: (
      <div className="text-foreground">
        <Box>Section in a box.</Box>
      </div>
    ),
  },
];

describe('Tabs', () => {
  it('(Snapshot) renders correctly', () => {
    const { asFragment } = render(<Tabs items={ITEMS} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) switches tabs', async () => {
    const { asFragment } = render(<Tabs items={ITEMS} />);
    await userEvent.click(await screen.findByText('About'));
    expect(asFragment()).toMatchSnapshot();
  });

  it('(Snapshot) renders in composition mode', async () => {
    const { asFragment } = render(
      <Tabs.Root>
        <Tabs.List>
          <Tabs.Tab>First</Tabs.Tab>
          <Tabs.Tab>Second</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>
            <div>First panel content</div>
          </Tabs.Panel>
          <Tabs.Panel>
            <div>Second panel content</div>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
