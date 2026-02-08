import { type FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { PlaylistIndexEntry } from '@nuclearplayer/model';
import { Card, CardGrid } from '@nuclearplayer/ui';

type PlaylistCardGridProps = {
  index: PlaylistIndexEntry[];
};

export const PlaylistCardGrid: FC<PlaylistCardGridProps> = ({ index }) => {
  const { t } = useTranslation('playlists');

  return (
    <CardGrid>
      {index.map((entry) => (
        <Card
          key={entry.id}
          title={entry.name}
          subtitle={t('trackCount', { count: entry.itemCount })}
        />
      ))}
    </CardGrid>
  );
};
