import { useNavigate } from '@tanstack/react-router';
import { EllipsisVerticalIcon, PlayIcon, Trash2Icon } from 'lucide-react';
import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';
import { Button, Dialog, Popover } from '@nuclearplayer/ui';

import { useQueueActions } from '../../../hooks/useQueueActions';
import { usePlaylistStore } from '../../../stores/playlistStore';
import { useSoundStore } from '../../../stores/soundStore';

type PlaylistDetailActionsProps = {
  playlistId: string;
  tracks: Track[];
};

export const PlaylistDetailActions: FC<PlaylistDetailActionsProps> = ({
  playlistId,
  tracks,
}) => {
  const { t } = useTranslation('playlists');
  const navigate = useNavigate();
  const { addToQueue, clearQueue } = useQueueActions();
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handlePlayAll = () => {
    clearQueue();
    addToQueue(tracks);
    useSoundStore.getState().play();
  };

  const handleAddToQueue = () => {
    addToQueue(tracks);
  };

  const handleDelete = async () => {
    await deletePlaylist(playlistId);
    setIsDeleteDialogOpen(false);
    navigate({ to: '/playlists' });
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <Button onClick={handlePlayAll} data-testid="play-all-button">
          <PlayIcon size={16} />
          {t('play')}
        </Button>
        <Popover
          className="relative"
          panelClassName="bg-background px-0 py-1"
          trigger={
            <Button size="icon" data-testid="playlist-actions-button">
              <EllipsisVerticalIcon size={16} />
            </Button>
          }
          anchor="bottom start"
        >
          <div className="flex flex-col">
            <button
              className="hover:border-border hover:bg-background-secondary flex w-full cursor-pointer items-center gap-3 border-t border-transparent px-3 py-2 text-left text-sm not-last:border-b"
              onClick={handleAddToQueue}
              data-testid="add-to-queue-action"
            >
              {t('addToQueue')}
            </button>
            <button
              className="text-accent-red hover:border-border hover:bg-background-secondary flex w-full cursor-pointer items-center gap-3 border-t border-transparent px-3 py-2 text-left text-sm not-last:border-b"
              onClick={() => setIsDeleteDialogOpen(true)}
              data-testid="delete-playlist-action"
            >
              <Trash2Icon size={16} />
              {t('delete')}
            </button>
          </div>
        </Popover>
      </div>
      <Dialog.Root
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <Dialog.Title>{t('delete')}</Dialog.Title>
        <Dialog.Description>{t('deleteConfirm')}</Dialog.Description>
        <Dialog.Actions>
          <Dialog.Close>{t('common:actions.cancel')}</Dialog.Close>
          <Button intent="danger" onClick={handleDelete}>
            {t('common:actions.delete')}
          </Button>
        </Dialog.Actions>
      </Dialog.Root>
    </>
  );
};
