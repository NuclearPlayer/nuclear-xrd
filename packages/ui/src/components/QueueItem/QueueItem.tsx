import { FC } from 'react';

import { QueueItemCollapsed } from './QueueItemCollapsed';
import { QueueItemExpanded } from './QueueItemExpanded';
import type { QueueItemProps } from './types';

export const QueueItem: FC<QueueItemProps> = ({
  isCollapsed = false,
  ...props
}) => {
  if (isCollapsed) {
    return <QueueItemCollapsed isCollapsed {...props} />;
  }

  return <QueueItemExpanded isCollapsed={false} {...props} />;
};
