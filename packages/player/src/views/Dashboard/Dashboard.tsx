import isEmpty from 'lodash-es/isEmpty';
import { FC, useMemo } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { DashboardProvider } from '@nuclearplayer/plugin-sdk';
import { ViewShell } from '@nuclearplayer/ui';

import { providersHost } from '../../services/providersHost';
import { DashboardEmptyState } from './components/DashboardEmptyState';
import { DASHBOARD_WIDGETS } from './dashboardWidgets';

export const Dashboard: FC = () => {
  const { t } = useTranslation('dashboard');

  const activeWidgets = useMemo(() => {
    const providers = providersHost.list('dashboard') as DashboardProvider[];
    const capabilities = new Set(
      providers.flatMap((provider) => provider.capabilities),
    );

    return DASHBOARD_WIDGETS.filter((widget) =>
      capabilities.has(widget.capability),
    );
  }, []);

  return (
    <ViewShell data-testid="dashboard-view" title={t('title')}>
      {isEmpty(activeWidgets) ? (
        <DashboardEmptyState />
      ) : (
        activeWidgets.map(({ capability, component: Widget }) => (
          <Widget key={capability} />
        ))
      )}
    </ViewShell>
  );
};
