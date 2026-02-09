import { useNavigate } from '@tanstack/react-router';
import { EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState, type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, Dialog, Popover } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../../stores/playlistStore';

type PlaylistDetailActionsProps = {
  playlistId: string;
};

export const PlaylistDetailActions: FC<PlaylistDetailActionsProps> = ({
  playlistId,
}) => {
  const { t } = useTranslation('playlists');
  const navigate = useNavigate();
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await deletePlaylist(playlistId);
    setIsDeleteDialogOpen(false);
    navigate({ to: '/playlists' });
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <Popover
          trigger={
            <Button size="icon" data-testid="playlist-actions-button">
              <EllipsisVerticalIcon size={16} />
            </Button>
          }
          anchor="bottom end"
        >
          <div className="flex flex-col gap-1 py-1">
            <button
              className="hover:bg-background-secondary text-accent-red flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              data-testid="delete-playlist-action"
            >
              <Trash2Icon size={14} />
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
