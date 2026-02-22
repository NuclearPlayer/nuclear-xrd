import { useNavigate } from '@tanstack/react-router';
import isEmpty from 'lodash-es/isEmpty';
import { Import, ListMusic, Plus } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import {
  Button,
  EmptyState,
  Popover,
  ScrollableArea,
  ViewShell,
} from '@nuclearplayer/ui';

import { usePlaylistImport } from '../../hooks/usePlaylistImport';
import { usePlaylistStore } from '../../stores/playlistStore';
import { CreatePlaylistDialog } from './components/CreatePlaylistDialog';
import { PlaylistCardGrid } from './components/PlaylistCardGrid';
import { PlaylistsProvider, usePlaylistsContext } from './PlaylistsContext';

const PlaylistsContent: FC = () => {
  const { t } = useTranslation('playlists');
  const navigate = useNavigate();
  const index = usePlaylistStore((state) => state.index);
  const { openCreateDialog } = usePlaylistsContext();
  const { importFromJson } = usePlaylistImport();

  return (
    <ViewShell data-testid="playlists-view" title={t('title')}>
      <div className="mb-4 flex items-center gap-2">
        <Button onClick={openCreateDialog} data-testid="create-playlist-button">
          <Plus size={16} />
          {t('create')}
        </Button>
        <Popover
          className="relative"
          panelClassName="bg-background px-0 py-0"
          trigger={
            <Button size="icon" data-testid="import-playlist-button">
              <Import size={16} />
            </Button>
          }
          anchor="bottom start"
        >
          <Popover.Menu>
            <Popover.Item
              icon={<Import size={16} />}
              onClick={importFromJson}
              data-testid="import-json-option"
            >
              {t('importJson')}
            </Popover.Item>
          </Popover.Menu>
        </Popover>
      </div>

      {isEmpty(index) ? (
        <EmptyState
          icon={<ListMusic size={48} />}
          title={t('empty')}
          description={t('emptyDescription')}
          className="flex-1"
        />
      ) : (
        <ScrollableArea className="flex-1 overflow-hidden">
          <PlaylistCardGrid
            index={index}
            onCardClick={(id) =>
              navigate({
                to: '/playlists/$playlistId',
                params: { playlistId: id },
              })
            }
          />
        </ScrollableArea>
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
