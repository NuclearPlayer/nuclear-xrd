import { LayoutDashboard } from 'lucide-react';
import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import { EmptyState } from '@nuclearplayer/ui';

export const DashboardEmptyState: FC = () => {
  const { t } = useTranslation('dashboard');

  return (
    <EmptyState
      data-testid="dashboard-empty-state"
      icon={<LayoutDashboard size={48} />}
      title={t('empty-state')}
      description={t('empty-state-description')}
      className="flex-1"
    />
  );
};
