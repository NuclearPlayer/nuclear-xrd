import { ListMusic } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState, ViewShell } from '@nuclearplayer/ui';

import { usePlaylistStore } from '../../stores/playlistStore';

export const Playlists: FC = () => {
  const { t } = useTranslation('playlists');
  const index = usePlaylistStore((state) => state.index);

  return (
    <ViewShell data-testid="playlists-view" title={t('title')}>
      {index.length === 0 ? (
        <EmptyState
          icon={<ListMusic size={48} />}
          title={t('empty')}
          description={t('emptyDescription')}
          className="flex-1"
        />
      ) : null}
    </ViewShell>
  );
};
