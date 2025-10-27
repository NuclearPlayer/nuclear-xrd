import { useTranslation } from '@nuclearplayer/i18n';
import { ViewShell } from '@nuclearplayer/ui';

export const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  return <ViewShell title={t('title')}>{t('content')}</ViewShell>;
};
