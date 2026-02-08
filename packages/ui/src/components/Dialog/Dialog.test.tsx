import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { Dialog } from '.';
import { DialogWrapper } from '../../test/DialogWrapper';

const StatefulDialog = ({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Playlist"
        description="This action cannot be undone."
      >
        <Dialog.Close>Cancel</Dialog.Close>
        <button>Delete</button>
      </Dialog>
    </>
  );
};

describe('Dialog', () => {
  it('(Snapshot) renders open dialog', () => {
    render(
      <Dialog
        open
        onClose={vi.fn()}
        title="Confirm"
        description="Are you sure?"
      >
        <button>OK</button>
      </Dialog>,
    );
    expect(DialogWrapper.panel).toMatchSnapshot();
  });

  it('(Snapshot) renders closed dialog', () => {
    const { container } = render(
      <Dialog
        open={false}
        onClose={vi.fn()}
        title="Confirm"
        description="Are you sure?"
      >
        <button>OK</button>
      </Dialog>,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays title and description when open', () => {
    render(
      <Dialog
        open
        onClose={vi.fn()}
        title="Create Playlist"
        description="Give your playlist a name."
      >
        <button>Create</button>
      </Dialog>,
    );
    expect(DialogWrapper.getByText('Create Playlist')).toBeInTheDocument();
    expect(
      DialogWrapper.getByText('Give your playlist a name.'),
    ).toBeInTheDocument();
  });

  it('closes when the close button is clicked', async () => {
    render(<StatefulDialog defaultOpen />);
    await DialogWrapper.closeButton.click();
    expect(DialogWrapper.isOpen()).toBe(false);
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Test" description="Test">
        <Dialog.Close>Cancel</Dialog.Close>
      </Dialog>,
    );
    await DialogWrapper.closeButton.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('opens and closes via external state', async () => {
    const user = userEvent.setup();
    render(<StatefulDialog />);

    expect(DialogWrapper.isOpen()).toBe(false);
    await user.click(screen.getByText('Open'));
    expect(DialogWrapper.isOpen()).toBe(true);
  });
});
