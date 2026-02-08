import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { Dialog } from '.';

const TestDialog = ({
  defaultOpen = true,
  onConfirm,
}: {
  defaultOpen?: boolean;
  onConfirm?: () => void;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Dialog</button>
      <Dialog.Root open={open} onClose={() => setOpen(false)}>
        <Dialog.Title>Test Title</Dialog.Title>
        <Dialog.Description>Test description text</Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close>Cancel</Dialog.Close>
          <button onClick={onConfirm}>Confirm</button>
        </Dialog.Actions>
      </Dialog.Root>
    </>
  );
};

describe('Dialog', () => {
  it('(Snapshot) renders open dialog', () => {
    render(<TestDialog />);
    expect(document.body).toMatchSnapshot();
  });

  it('(Snapshot) renders closed dialog', () => {
    render(<TestDialog defaultOpen={false} />);
    expect(document.body).toMatchSnapshot();
  });

  it('displays title and description when open', () => {
    render(<TestDialog />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description text')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<TestDialog />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<TestDialog onConfirm={onConfirm} />);

    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('opens dialog when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDialog defaultOpen={false} />);

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    await user.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
