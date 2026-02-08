import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button, Dialog, Input } from '@nuclearplayer/ui';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Confirmation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Delete Playlist</Button>
        <Dialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Delete Playlist"
          description="Are you sure you want to delete this playlist? This action cannot be undone."
          actions={
            <>
              <Dialog.Close>Cancel</Dialog.Close>
              <Button intent="danger" onClick={() => setIsOpen(false)}>
                Delete
              </Button>
            </>
          }
        />
      </>
    );
  },
};

export const WithInput: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Create Playlist</Button>
        <Dialog.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Dialog.Title>Create new playlist</Dialog.Title>
          <Dialog.Description>
            Give your playlist a name to get started.
          </Dialog.Description>
          <div className="mt-4">
            <Input
              label="Name"
              placeholder="My playlist"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Dialog.Actions>
            <Dialog.Close>Cancel</Dialog.Close>
            <Button onClick={() => setIsOpen(false)}>Create</Button>
          </Dialog.Actions>
        </Dialog.Root>
      </>
    );
  },
};
