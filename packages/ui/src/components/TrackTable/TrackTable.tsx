import { useMemo } from 'react';

import { Track } from '@nuclearplayer/model';

import { mergeLabels } from './labels';
import { TrackTableProps } from './types';

export function TrackTable<T extends Track = Track>(props: TrackTableProps<T>) {
  const { tracks, className, labels } = props;
  const mergedLabels = useMemo(() => mergeLabels(labels), [labels]);
  return (
    <div className={className} aria-label={props['aria-label']} role="grid">
      <div role="rowgroup">
        <div role="row">
          <div role="columnheader">{mergedLabels.playNow}</div>
          <div role="columnheader">Title</div>
        </div>
      </div>
      <div role="rowgroup">
        {tracks.map((t, index) => {
          return (
            <div
              role="row"
              key={index}
              style={{ display: 'flex', gap: 8, padding: '4px 0' }}
            >
              <div role="gridcell">▶</div>
              <div role="gridcell">{t.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
