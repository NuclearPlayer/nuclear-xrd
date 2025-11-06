import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { QueuePanel } from '@nuclearplayer/ui';

import { useCurrentQueueItem } from '../hooks/useCurrentQueueItem';
import { useQueue } from '../hooks/useQueue';
import { useQueueActions } from '../hooks/useQueueActions';

type ConnectedQueuePanelProps = {
  isCollapsed?: boolean;
};

export const ConnectedQueuePanel: FC<ConnectedQueuePanelProps> = ({
  isCollapsed = false,
}) => {
  const { t } = useTranslation('queue');
  const queue = useQueue();
  const currentItem = useCurrentQueueItem();
  const actions = useQueueActions();

  const handleReorder = (fromIndex: number, toIndex: number) => {
    actions.reorder(fromIndex, toIndex);
  };

  const handleSelectItem = (itemId: string) => {
    actions.goToId(itemId);
  };

  const handleRemoveItem = (itemId: string) => {
    actions.removeByIds([itemId]);
  };

  return (
    <QueuePanel
      items={queue.items}
      currentItemId={currentItem?.id}
      isCollapsed={isCollapsed}
      reorderable
      onReorder={handleReorder}
      onSelectItem={handleSelectItem}
      onRemoveItem={handleRemoveItem}
      labels={{
        emptyTitle: t('empty.title'),
        emptySubtitle: t('empty.subtitle'),
        removeButton: t('actions.remove'),
        errorPrefix: t('error.prefix'),
      }}
    />
  );
};
