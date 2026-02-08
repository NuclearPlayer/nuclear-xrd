import isEmpty from 'lodash-es/isEmpty';
import { ListMusic, Plus } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { Button, EmptyState, ViewShell } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../stores/playlistStore';
import { CreatePlaylistDialog } from './components/CreatePlaylistDialog';
import { PlaylistCardGrid } from './components/PlaylistCardGrid';
import { PlaylistsProvider, usePlaylistsContext } from './PlaylistsContext';

const PlaylistsContent: FC = () => {
  const { t } = useTranslation('playlists');
  const index = usePlaylistStore((state) => state.index);
  const { openCreateDialog } = usePlaylistsContext();

  return (
    <ViewShell data-testid="playlists-view" title={t('title')}>
      <div className="mb-4 flex items-center gap-2">
        <Button onClick={openCreateDialog} data-testid="create-playlist-button">
          <Plus size={16} />
          {t('create')}
        </Button>
      </div>

      {isEmpty(index) ? (
        <EmptyState
          icon={<ListMusic size={48} />}
          title={t('empty')}
          description={t('emptyDescription')}
          className="flex-1"
        />
      ) : (
        <PlaylistCardGrid index={index} />
      )}

      <CreatePlaylistDialog />
    </ViewShell>
  );
};

export const Playlists: FC = () => (
  <PlaylistsProvider>
    <PlaylistsContent />
  </PlaylistsProvider>
);
