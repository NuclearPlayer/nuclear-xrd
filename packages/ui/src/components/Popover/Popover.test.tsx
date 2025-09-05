import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '..';
import { Popover } from './Popover';

describe('Popover', () => {
  it('(Snapshot) renders with all props', async () => {
    render(
      <Popover
        className="border-accent-red"
        anchor="right"
        trigger={<Button>Open Popover</Button>}
      >
        Popover Content
      </Popover>,
    );
    await userEvent.click(screen.getByText('Open Popover'));
    await screen.findByText('Popover Content');
    expect(document.body).toMatchSnapshot();
  });

  it('(Snapshot) renders with backdrop', async () => {
    render(
      <Popover trigger={<Button>Open Popover</Button>} backdrop>
        Popover Content
      </Popover>,
    );
    await userEvent.click(screen.getByText('Open Popover'));
    await screen.findByText('Popover Content');
    expect(document.body).toMatchSnapshot();
  });
});
