import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';

import { Button, Toaster } from '@nuclearplayer/ui';

const meta = {
  title: 'Components/Toaster',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Toaster richColors />
      <div className="flex gap-2">
        <Button
          onClick={() =>
            toast('Plain message', {
              description: 'This is a plain message.',
            })
          }
        >
          Show
        </Button>
        <Button
          onClick={() =>
            toast.success('Saved!', {
              description: 'Your changes are live.',
            })
          }
        >
          Success
        </Button>
        <Button
          onClick={() =>
            toast.error('Something broke', {
              description: 'Try again in a moment.',
            })
          }
        >
          Error
        </Button>
        <Button
          onClick={() =>
            toast.info('Heads up', { description: 'FYI message.' })
          }
        >
          Info
        </Button>
        <Button
          onClick={() =>
            toast.warning('Careful', { description: 'This is risky.' })
          }
        >
          Warning
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() =>
            toast('With action', {
              description: 'Undo the change?',
              action: { label: 'Undo', onClick: () => toast.success('Undone') },
            })
          }
        >
          With action
        </Button>
        <Button
          onClick={() =>
            toast('With cancel button', {
              description: 'Are you sure you want to cancel?',
              cancel: { label: 'Cancel', onClick: () => toast.dismiss() },
            })
          }
        >
          With cancel button
        </Button>
        <Button
          onClick={() => {
            const id = toast.loading('Syncing library…');
            setTimeout(
              () => toast.success('Synced successfully', { duration: 1500 }),
              1000,
            );
            setTimeout(() => toast.dismiss(id), 1200);
          }}
        >
          Loading
        </Button>
      </div>
    </div>
  ),
};
